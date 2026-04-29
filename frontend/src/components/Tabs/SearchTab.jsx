export default function SearchTab({ results }) {
  return (
    <div>
      <h3>Results</h3>

      {results.length === 0 && <p>No results</p>}

      {results.map((r, i) => (
        <div key={i} className="card">
          <div>#{i + 1}</div>
          <div>{r.metadata}</div>
          <div>Distance: {r.distance}</div>
        </div>
      ))}
    </div>
  );
}