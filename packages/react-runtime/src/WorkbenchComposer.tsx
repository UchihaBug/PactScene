import { Send } from "lucide-react";
import type { FormEvent } from "react";

interface WorkbenchComposerProps {
  value: string;
  suggestions: string[];
  onValueChange: (value: string) => void;
  onSubmit: () => void;
}

export function WorkbenchComposer({ value, suggestions, onValueChange, onSubmit }: WorkbenchComposerProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="asw-composer" aria-label="Ask a business question">
      <div className="asw-section-title">
        <span>Ask a business question</span>
        <strong>safe planner</strong>
      </div>
      <form onSubmit={submit} className="asw-composer-form">
        <textarea
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder="show open orders this month"
          rows={6}
        />
        <button type="submit" className="asw-primary-button" aria-label="Run scene planning">
          <Send size={16} aria-hidden="true" />
          <span>Run</span>
        </button>
      </form>
      <div className="asw-suggestions" aria-label="Prompt suggestions">
        {suggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => onValueChange(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}
