import { ContextItem } from "./client-types"

const codeSketchFormat = `
  <code_sketch>
      [overview]: Describes the overall purpose or functionality of the code.
      [target_lang]: Specifies the target/output programming language.
      [custom_hints]: A map of arbitrary custom/user-defined properties and values to guide the generation process.

      <sketch>
          The core sketch content goes here.

          The sketch is a kind of mixed pseudocode that may involve syntactic statements from a particular language, along with free-form indications for the LLM to help guide its inference on how to "fill in the blanks". Comments should be interpreted as messages from the user to the LLM.
      </sketch>
  </code_sketch>
  `

const sketchProcessingPreamble = (sketch: string, contextItems: ContextItem[] = [{id: "-1", content: 'no additional context'}]) => {
  return `Here are additional context items you'll need later; please refer back to these as needed:

  ${contextItems.map(ci => "<context_item>" + ci.content + "</context_item>")}

  ## Code Sketch system description

  A "Code Sketch" is a particular language/format which developers write in in order to guide LLMs to author code. Their sketches will come in varying levels of detail; it is your responsibility to take this sketch/spec and translate it into production-level, complete code. The core of this task is expertly "filling in the blanks": the pseudocode they write provides a basic framework—but it will be incomplete and informal. The ideal way of reading their spec is to take collectively everything that's been stated within it to understand their intentions, and to use your understanding of their intentions to produce the corresponding production code.

  ## Basic Structure
${codeSketchFormat}

  ## Actual Task

  The following is a Code Sketch written by a developer that's ready for you to process:

  <code_sketch>
  ${sketch}
  </code_sketch>`
}

export const genCodePrompt = (sketch: string, contextItems: ContextItem[]) => {
  return `${sketchProcessingPreamble(sketch, contextItems)}

  Please generate corresponding production quality code that you believe best satisfies their intentions expressed through the spec. Please wrap your generated code in <code target_lang="..."> ... </code>. Do NOT use placeholders, temporary solutions, nor stubbed out functions; the resulting code should be directly executable.
  `
}

export const genReviewPrompt = (sketch: string, contextItems: ContextItem[]) => {
  return `${sketchProcessingPreamble(sketch, contextItems)}
  Please review the code sketch looking for any potentially mistaken assumptions, ambiguities, or inconsistencies which the developer may not be aware of.

  Your goal will be to generate an annotated version of their given sketch where you've interspersed:

  <LLMQuestion question="...">...</LLMQuestion>

  —tags wrapping the pieces of the code pertaining to the mistaken assumption, ambiguity, inconsistency etc. you're presently address. You should always formulate your comment on these uncertain code pieces as a question so that the developer has a natural way of addressing them, one-by-one preceding a next iteration of their sketch.

  If the issue you've spotted does not have high spatial coherence (i.e. the pieces of code relating to it are not contiguous), you may use the tag like:

  <LLMQuestion question="..."/>

  —so that it's a standalone tag rather than a wrapping tag-pair.

  Don't ask questions about things you could likely work out for yourself: that's a core motivation of the user writing this system in the first place: they'd like for you to work out the details wherever possible. This review system is for getting at deeper potential design flaws. The highest value 'items' you can locate will likely relate to fundamental misconceptions or oversights, rather than code line-level 'nitpick' kinda things. Of course if an issue can be localized to a line you should use take advantage of the annotation system to highlight this. Additionally, the goal here is to improve what they've so far worked on describing rather than to expanding or 'enhancing' it.

  Anything you write outside of the "<code_sketch>...</code_sketch>" tags will not be displayed to the user, so anything you want to communicate should be within <LLMQuestion question="..."> tags.

  Please generate your annotated review of the foregoing sketch now.
 `
}

export const getRefineSketchPrompt = (reconstructedSketch: string) => {
  return `${sketchProcessingPreamble(reconstructedSketch)}

  This sketch has gone through review with an LLM and should contain a number of question response pairs, though no question will necessarily have a response; if a response is missing you can still use the question in your consideration of how to update the sketch.

  In your revised sketch you should aim to stick as closely as possible to the original author's content, but update it as needed according to the questions and responses.

  Your output should be strictly the refined sketch between <code_sketch> and </code_sketch> tags, without the explicit questions and responses in the document but rather having been incorporated in the refinement itself.

  You should produce no text before or after these code_sketch tags; the entirety of your response should be the refined code sketch.
  `
}
