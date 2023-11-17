import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "loopmessage",
  propDefinitions: {
    alertType: {
      type: "string",
      label: "Alert Type",
      description: "The type of the alert received via webhook.",
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "The name of the sender of the alert.",
    },
    recipient: {
      type: "string",
      label: "Recipient",
      description: "The recipient of the message. This can be a phone number or email address.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the message.",
    },
    statusCallback: {
      type: "string",
      label: "Status Callback",
      description: "The URL that will receive status updates for this message. Check the [Webhooks](https://docs.loopmessage.com/imessage-conversation-api/messaging/webhooks) section for details. Max length is 256 characters.",
      optional: true,
    },
    statusCallbackHeader: {
      type: "string",
      label: "Status Callback Header",
      description: "The custom Authorization header will be contained in the callback request. Max length is 256 characters.",
      optional: true,
    },
    service: {
      type: "string",
      label: "Service",
      description: "You can choose which service to use to deliver the message. Your sender name must have an active SMS feature. SMS does not support `subject`, `effect`, or `reply_to_id` parameters. `attachments` in SMS - only support pictures (MMS).",
      options: constants.SERVICES,
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the message. A recipient will see this subject as a bold title before the message text.",
      optional: true,
    },
    effect: {
      type: "string",
      label: "Effect",
      description: "Add effect to your message. You can check the [Apple guide]() about `expressive messages`.",
      options: constants.EFFECTS,
      optional: true,
    },
    contacts: {
      type: "string[]",
      label: "Contacts",
      description: "An array of contacts to send the message to. Should contain phone numbers in international formats or email addresses. Example: `[\"+13231112233\", \"steve@mac.com\", \"1(787)111-22-33\"]`. Invalid recipients will be skipped.",
    },
    region: {
      type: "string",
      label: "Region",
      description: "Value in [ISO-2 country code](https://en.wikipedia.org/wiki/ISO_3166-2). For example: `US`, `GB`, `CA`, `AU` etc. This parameter should be passed only if you passed phone numbers without a country code.",
      optional: true,
    },
  },
  methods: {
    _baseUrl(api = constants.API.SERVER) {
      const baseUrl = `${constants.BASE_URL}${constants.VERSION_PATH}`;
      return baseUrl.replace(constants.API_PLACEHOLDER, api);
    },
    _makeRequest({
      $ = this,
      method = "POST",
      path,
      headers,
      api,
      ...otherOpts
    } = {}) {
      const url = `${this._baseUrl(api)}${path}`;
      const config = {
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.authorization_key}`,
          "Loop-Secret-Key": `${this.$auth.secret_api_key}`,
          ...headers,
        },
        ...otherOpts,
      };
      return axios($, config);
    },
    sendMessage(args = {}) {
      return this._makeRequest({
        path: "/message/send/",
        ...args,
      });
    },
    singleLookup(args = {}) {
      return this._makeRequest({
        api: constants.API.LOOKUP,
        path: "/contact/lookup/",
        ...args,
      });
    },
  },
};