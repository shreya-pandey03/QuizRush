"use client";

export default function QuestionOptions() {
  const options = ["Library", "Database", "Language", "Server"];

  return (
    <div
      className="
space-y-2
mt-4
"
    >
      {options.map((option) => (
        <button
          key={option}
          className="
block
border
p-2
w-full
"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
