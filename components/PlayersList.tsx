import { useLobbyStore } from "@/store/lobbyStore";

export default function PlayersList() {
  const players = useLobbyStore((s) => s.players);

  return (
    <div>
      {players.map((player) => (
        <div key={player.id}>{player.name}</div>
      ))}
    </div>
  );
}
