import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dynapictures",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Select the template to use for image generation",
      async options() {
        const templates = await this.listTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    imageParams: {
      type: "string[]",
      label: "Image Parameters",
      description: "Customize the parameters for the image layers as a JSON document",
    },
    targetUrl: {
      type: "string",
      label: "Target URL",
      description: "The URL of the REST endpoint that will receive notifications",
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Type of the event to subscribe for",
      default: "NEW_IMAGE",
      options: [
        {
          label: "New Image",
          value: "NEW_IMAGE",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dynapictures.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async listTemplates() {
      return this._makeRequest({
        path: "/templates",
      });
    },
    async generateImage({ templateId, imageParams }) {
      return this._makeRequest({
        method: "POST",
        path: "/images",
        data: {
          templateId,
          params: imageParams.map(JSON.parse),
        },
      });
    },
    async subscribeWebhook({ targetUrl, eventType, templateId }) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks",
        data: {
          targetUrl,
          eventType,
          templateId,
        },
      });
    },
    async unsubscribeWebhook({ targetUrl, eventType, templateId }) {
      return this._makeRequest({
        method: "DELETE",
        path: "/hooks",
        data: {
          targetUrl,
          eventType,
          templateId,
        },
      });
    },
  },
};