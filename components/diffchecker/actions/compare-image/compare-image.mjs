import diffchecker from "../../diffchecker.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diffchecker-compare-image",
  name: "Compare Images",
  description: "Compares two images and returns the result. [See the documentation](https://www.diffchecker.com/public-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    diffchecker,
    leftImage: {
      type: "string",
      label: "Left Image",
      description: "The data URL or file path of the left image to compare.",
    },
    rightImage: {
      type: "string",
      label: "Right Image",
      description: "The data URL or file path of the right image to compare.",
    },
    outputType: {
      propDefinition: [
        diffchecker,
        "outputType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.diffchecker.compareImages({
      leftImage: this.leftImage,
      rightImage: this.rightImage,
      inputType: "form", // Default value as per the app file, not exposed to the user.
      outputType: this.outputType,
    });

    $.export("$summary", "Compared images successfully");
    return response;
  },
};