/**
 * Renders `text` with one short phrase in the accent red. If the phrase is
 * missing or doesn't occur in the text, the text renders plain rather than
 * emphasising the wrong words.
 */
export function Emphasis({ text, phrase }: { text: string; phrase?: string }) {
  const at = phrase ? text.indexOf(phrase) : -1
  if (!phrase || at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <span className="font-bold text-brand">{phrase}</span>
      {text.slice(at + phrase.length)}
    </>
  )
}
