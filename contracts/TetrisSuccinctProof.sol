
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TetrisSuccinctProof {
    struct Game {
        address player;
        uint256 score;
        bytes proof;
    }

    mapping(address => Game) public games;

    function submitGame(bytes memory proof, uint256 score) public {
        games[msg.sender] = Game(msg.sender, score, proof);
    }

    function getGame(address player) public view returns (Game memory) {
        return games[player];
    }
}
