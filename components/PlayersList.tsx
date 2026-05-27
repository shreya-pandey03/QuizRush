interface PlayersListProps {
  lobbyId: string;
}

export default function PlayersList({
  lobbyId,
}: PlayersListProps) {
  return (
    <div className="rounded-xl bg-white/5 p-4 text-white">
      Players in lobby: {lobbyId}
    </div>
  );
}