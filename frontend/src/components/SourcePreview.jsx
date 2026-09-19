import ReactMarkdown from "react-markdown";

function SourcePreview({ sources }) {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl mt-4 text-medium text-center text-[#ff9839]">
        Source Preview
      </h1>
      <div className="flex-1 p-8 break-words overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-600 active:scrollbar-thumb-gray-600">
        {sources?.map(([source, source_content]) => (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{source}</h2>
            <ReactMarkdown className="prose lg:prose-lg dark:prose-invert">
              {source_content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SourcePreview;
