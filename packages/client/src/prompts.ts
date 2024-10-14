import { ContextItem } from "./client-types"

export const genCodePrompt = (sketch: string, contextItems: ContextItem[]) => {
  return `
  Here are additional context items you'll need later; please refer back to these as needed:

  ${contextItems.map(ci => "<context_item>" + ci.content + "</context_item>")}

  ## Code Sketch system description

  A "Code Sketch" is a particular language/format which developers write in in order to guide LLMs to author code. Their sketches will come in varying levels of detail; it is your responsibility to take this sketch/spec and translate it into production-level, complete code. The core of this task is expertly "filling in the blanks": the pseudocode they write provides a basic framework—but it will be incomplete and informal. The ideal way of reading their spec is to take collectively everything that's been stated within it to understand their intentions, and to use your understanding of their intentions to produce the corresponding production code.

  ## Basic Structure
  <code_sketch>
      [purpose]: Describes the overall purpose or functionality of the code.
      [target_lang]: Specifies the target/output programming language.
      [custom_config]: A map of arbitrary custom/user-defined properties and values to guide the generation process.

      <sketch>
          The core sketch content goes here.

          The sketch is a kind of mixed pseudocode that may involve syntactic statements from a particular language, along with free-form indications for the LLM to help guide its inference on how to "fill in the blanks". Comments should be interpreted as messages from the user to the LLM.
      </sketch>
  </code_sketch>

  ## Actual Task

  The following is a Code Sketch written by a developer and is ready for you to process:

  <code_sketch>
  ${sketch}
  </code_sketch>

  Please generate corresponding production quality code that you believe best satisfies their intentions expressed through the spec. Please wrap your generated code in <code target_lang="..."> ... </code>. Do NOT use placeholders; the resulting code should be directly executable.
  `
}
