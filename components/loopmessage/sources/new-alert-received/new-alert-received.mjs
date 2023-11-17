import { axios } from "@pipedream/platform";
import loopmessage from "../../loopmessage.app.mjs";

export default {
  key: "loopmessage-new-alert-received",
  name: "New Alert Received",
  description: "Emit an event when an alert is received via webhook. [See the documentation](https://docs.loopmessage.com/imessage-conversation-api/messaging/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    loopmessage,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    alertType: {
      propDefinition: [
        loopmessage,
        "alertType",
      ],
    },
    senderName: {
      propDefinition: [
        loopmessage,
        "senderName",
      ],
    },
  },
  hooks: {
    async activate() {
      // You can add activation logic here, if necessary
    },
    async deactivate() {
      // You can add deactivation logic here, if necessary
    },
  },
  methods: {
    verifyWebhook(headers) {
      const expectedSignature = this.db.get("webhookSignature");
      const signature = headers["Loop-Signature"];
      if (!expectedSignature || signature !== expectedSignature) {
        throw new Error("Invalid signature");
      }
    },
  },
  async run(event) {
    this.verifyWebhook(event.headers);
    const { body } = event;
    this.$emit(body, {
      id: body.id,
      summary: `New alert received: Type - ${body.alert_type}, Sender - ${body.sender_name}`,
      ts: Date.parse(body.created_at),
    });
    this.http.respond({
      status: 200,
    });
  },
};