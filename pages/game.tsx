import { useState } from "react";
import Map from "../components/Map";
import QuestionPanel from "../components/QuestionPanel";
import { ADJ } from "../utils/adjacency";
import "../styles/game.css";

type Owner = "unowned" | "player1" | "player2";

const TOPICS = ["general", "sports", "history", "science", "movies"];
const DIFFICULTIES = ["easy", "medium", "hard"] as const;
type Difficulty = typeof DIFFICULTIES[number];

export default function GamePage() {
  const [turn, setTurn] = useState<Owner>("player1");
  const [regionOwner, setRegionOwner] = useState<Record<string, Owner>>({});
  const [activeRegion, setActiveRegion] = useState<string>("");
  const [choosingTopic, setChoosingTopic] = useState(false);
  const [chosenTopic, setChosenTopic] = useState<string | null>(null);
  const [initialClaim, setInitialClaim] = useState<Record<Owner, boolean>>({
    player1: false,
    player2: false,
    unowned: true,
  });
  const [winner, setWinner] = useState<Owner | null>(null);

  // Dificultate de bază aleasă la început
  const [baseDifficulty, setBaseDifficulty] = useState<Difficulty | null>(null);
  // Dificultate efectivă pentru întrebarea curentă
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty | null>(null);

  const switchTurn = () =>
    setTurn((prev) => (prev === "player1" ? "player2" : "player1"));

  const checkWinner = (owners: Record<string, Owner>): Owner | null => {
    const countPlayer1 = Object.values(owners).filter((o) => o === "player1").length;
    const countPlayer2 = Object.values(owners).filter((o) => o === "player2").length;

    if (countPlayer1 === 0) return "player2";
    if (countPlayer2 === 0) return "player1";
    return null;
  };

  const getNextDifficulty = (current: Difficulty): Difficulty => {
    const idx = DIFFICULTIES.indexOf(current);
    if (idx === -1 || idx === DIFFICULTIES.length - 1) return current;
    return DIFFICULTIES[idx + 1];
  };

  const setDifficulty = (diff: Difficulty) => {
    setBaseDifficulty(diff);
    setCurrentDifficulty(diff);
  };

  const handleRegionClick = (regionId: string) => {
    if (activeRegion || winner || !baseDifficulty) return;

    const owner = regionOwner[regionId] ?? "unowned";

    if (!initialClaim[turn]) {
      if (owner !== "unowned") return;
      setRegionOwner((prev) => ({ ...prev, [regionId]: turn }));
      setInitialClaim((prev) => ({ ...prev, [turn]: true }));
      switchTurn();
      return;
    }

    if (owner === turn) return;

    const owned = Object.keys(regionOwner).filter((id) => regionOwner[id] === turn);
    const adjacent = owned.some((id) => ADJ[id]?.includes(regionId));
    if (!adjacent) return;

    if (owner === "unowned") {
      setChosenTopic("general");
      setActiveRegion(regionId);
      setChoosingTopic(false);
      setCurrentDifficulty(baseDifficulty); // păstrăm dificultatea normală
      return;
    }

    // atac pe teritoriu adversar: creștem dificultatea temporar
    setCurrentDifficulty(getNextDifficulty(baseDifficulty));

    setActiveRegion(regionId);
    setChoosingTopic(true);
    setChosenTopic(null);
  };

  const confirmTopic = (topic: string) => {
    setChosenTopic(topic);
    setChoosingTopic(false);
  };

  const handleResult = (correct: boolean) => {
    if (winner) return;

    if (correct) {
      setRegionOwner((prev) => {
        const updated = { ...prev, [activeRegion]: turn };
        const w = checkWinner(updated);
        if (w) setWinner(w);
        return updated;
      });
    }
    setActiveRegion("");
    setChosenTopic(null);
    setCurrentDifficulty(baseDifficulty); // revenim la dificultatea de bază
    if (!winner) switchTurn();
  };

  if (!baseDifficulty) {
    return (
      <div className="page">
        <header className="topBar">Triviador-AI</header>
        <div className="difficultyChooser">
          <h2>Alege dificultatea întrebărilor</h2>
          {DIFFICULTIES.map((diff) => (
            <button key={diff} className="answerBtn" onClick={() => setDifficulty(diff)}>
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const needStart = !initialClaim[turn];

  return (
    <div className="page">
      <header className="topBar">Triviador-AI</header>

      <div className="body">
        <div className="mapPane">
          <div className="turnBox">
            Turn:&nbsp;
            <span className={turn === "player1" ? "blue" : "red"}>{turn}</span>
          </div>

          {needStart && <p className="startHint">Selectează teritoriul de început!</p>}

          <div className="mapWrapper">
            <Map
              currentPlayer={turn}
              regionOwner={regionOwner}
              onSelect={handleRegionClick}
              disabled={!!activeRegion}
            />
          </div>
        </div>

        {winner && (
          <div className="winnerBanner">
            <h2>
              Joc terminat! Câștigător: {winner === "player1" ? "Jucător 1" : "Jucător 2"}
            </h2>
          </div>
        )}

        {choosingTopic && (
          <aside className="questionDrawer">
            <h3>Alege topicul pentru întrebare (jucătorul adversar)</h3>
            <div className="flex flex-col gap-2">
              {TOPICS.map((t) => (
                <button key={t} className="answerBtn" onClick={() => confirmTopic(t)}>
                  {t}
                </button>
              ))}
              <button
                className="answerBtn wrong"
                onClick={() => confirmTopic("general")}
              >
                Sar peste și folosesc topic general
              </button>
            </div>
          </aside>
        )}

        {activeRegion && chosenTopic && !choosingTopic && (
          <>
            <div className="backdrop" onClick={() => handleResult(false)} />
            <aside className="questionDrawer">
              <p>
                Topic ales: <strong>{chosenTopic}</strong> | Dificultate:{" "}
                <strong>{currentDifficulty}</strong>
              </p>
              <QuestionPanel
                regionId={activeRegion}
                onResult={handleResult}
                topic={chosenTopic}
                difficulty={currentDifficulty!}
              />
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
