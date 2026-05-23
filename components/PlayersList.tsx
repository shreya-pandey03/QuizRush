export default function PlayersList() {
  const players = ["Virat", "Anchal", "Shreya"];

  return (
    <div>
      <h2>Players</h2>

      {players.map((p) => (
        <div key={p}>{p}</div>
      ))}
    </div>
  );
}
