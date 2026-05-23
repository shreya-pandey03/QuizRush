interface Props {
  params: {
    gameId: string;
  };
}

export default function GameDetail({ params }: Props) {
  return (
    <div className="p-6">
      <h1>
        Game:
        {params.gameId}
      </h1>
    </div>
  );
}
