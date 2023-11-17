import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "diffchecker",
  propDefinitions: {
    outputType: {
      type: "string",
      label: "Output Type",
      description: "Specifies the type of output you receive in the response body.",
      options: [
        "json",
        "html",
        "html_json",
      ],
    },
    diffLevel: {
      type: "string",
      label: "Diff Level",
      description: "Specifies whether you want to diff by word or character.",
      options: [
        "word",
        "character",
      ],
    },
    leftText: {
      type: "string",
      label: "Left Text",
      description: "The text for the left side of the text comparison.",
    },
    rightText: {
      type: "string",
      label: "Right Text",
      description: "The text for the right side of the text comparison.",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.environment}.diffchecker.com/public`;
    },
    _getHeaders(headers = {}) {
      if (this.$auth.api_key) {
        headers["X-Api-Key"] = this.$auth.api_key;
      }
      return headers;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;

      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: this._getHeaders(headers),
        ...otherOpts,
      });
    },
    async compareText({ leftText, rightText, diffLevel }) {
      return this._makeRequest({
        method: "POST",
        path: "/text",
        data: {
          left: leftText,
          right: rightText,
          diff_level: diffLevel,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    async comparePdfs({ leftPdf, rightPdf, outputType, diffLevel }) {
      const data = new URLSearchParams();
      data.append('left_pdf', leftPdf);
      data.append('right_pdf', rightPdf);

      return this._makeRequest({
        method: "POST",
        path: `/pdf?output_type=${outputType}${diffLevel ? `&diffLevel=${diffLevel}` : ''}`,
        data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
    async compareImages({ leftImage, rightImage, inputType, outputType }) {
      const data = new URLSearchParams();
      data.append('left_image', leftImage);
      data.append('right_image', rightImage);

      return this._makeRequest({
        method: "POST",
        path: `/image?input_type=${inputType}&output_type=${outputType}`,
        data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
  },
};