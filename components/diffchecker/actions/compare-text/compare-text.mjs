import diffchecker from "../../diffchecker.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diffchecker-compare-text",
  name: "Compare Text",
  description: "Compares two pieces of text and returns the result. [See the documentation](https://www.diffchecker.com/public-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    diffchecker,
    leftText: {
      propDefinition: [
        diffchecker,
        "leftText",
      ]
    },
    rightText: {
      propDefinition: [
        diffchecker,
        "rightText",
      ]
    },
    diffLevel: {
      propDefinition: [
        diffchecker,
        "diffLevel",
      ]
    },
    outputType: {
      propDefinition: [
        diffchecker,
        "outputType",
      ]
    },
  },
  async run({ $ }) {
    const response = await this.diffchecker._makeRequest({
      method: "POST",
      path: "/text",
      data: {
        left: this.leftText,
        right: this.rightText,
        diff_level: this.diffLevel,
        output_type: this.outputType,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    $.export("$summary", "Compared text successfully");
    return response;
  },
};