import React from 'react';
import styled from 'styled-components';

const StyledGame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.5rem;
  width: 25%;
  justify-self: right;
  padding-right: 0;
  position: absolute;
  right: 0;
`;

const ScorePanel = ({ score, restartGame }) => {
    return (
        <StyledGame>
            <p>Score: {score}</p>
            <button onClick={restartGame}>Restart Game</button>
        </StyledGame>
    );
}

export default ScorePanel;

