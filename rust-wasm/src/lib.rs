
//! Tetris Succinct Rosita - Motor básico en Rust

use std::time::{Duration, Instant};
use rand::prelude::*;

const BOARD_WIDTH: usize = 10;
const BOARD_HEIGHT: usize = 20;
const INITIAL_DROP_INTERVAL: Duration = Duration::from_millis(300);

#[derive(Clone, Copy)]
enum TetrominoType {
    I, O, T, S, Z, J, L
}

struct Tetromino {
    kind: TetrominoType,
    rotation: usize,
    x: isize,
    y: isize,
}

struct GameState {
    board: [[Option<TetrominoType>; BOARD_WIDTH]; BOARD_HEIGHT],
    current_piece: Tetromino,
    drop_timer: Instant,
    score: u32,
}

impl GameState {
    fn new() -> Self {
        Self {
            board: [[None; BOARD_WIDTH]; BOARD_HEIGHT],
            current_piece: GameState::random_piece(),
            drop_timer: Instant::now(),
            score: 0,
        }
    }

    fn random_piece() -> Tetromino {
        let mut rng = rand::thread_rng();
        Tetromino {
            kind: match rng.gen_range(0..7) {
                0 => TetrominoType::I,
                1 => TetrominoType::O,
                2 => TetrominoType::T,
                3 => TetrominoType::S,
                4 => TetrominoType::Z,
                5 => TetrominoType::J,
                _ => TetrominoType::L,
            },
            rotation: 0,
            x: (BOARD_WIDTH / 2) as isize - 1,
            y: 0,
        }
    }

    fn update(&mut self) {
        if self.drop_timer.elapsed() >= INITIAL_DROP_INTERVAL {
            if !self.check_collision(0, 1) {
                self.current_piece.y += 1;
            } else {
                self.lock_piece();
                self.clear_lines();
                self.current_piece = GameState::random_piece();
            }
            self.drop_timer = Instant::now();
        }
    }

    fn move_left(&mut self) {
        if !self.check_collision(-1, 0) {
            self.current_piece.x -= 1;
        }
    }

    fn move_right(&mut self) {
        if !self.check_collision(1, 0) {
            self.current_piece.x += 1;
        }
    }

    fn rotate(&mut self) {
        self.current_piece.rotation = (self.current_piece.rotation + 1) % 4;
    }

    fn check_collision(&self, dx: isize, dy: isize) -> bool {
        let new_x = self.current_piece.x + dx;
        let new_y = self.current_piece.y + dy;

        new_x < 0 || new_x >= BOARD_WIDTH as isize || new_y >= BOARD_HEIGHT as isize ||
        (new_y >= 0 && new_x >= 0 && new_x < BOARD_WIDTH as isize && new_y < BOARD_HEIGHT as isize && self.board[new_y as usize][new_x as usize].is_some())
    }

    fn lock_piece(&mut self) {
        let x = self.current_piece.x as usize;
        let y = self.current_piece.y as usize;
        if y < BOARD_HEIGHT && x < BOARD_WIDTH {
            self.board[y][x] = Some(self.current_piece.kind);
        }
    }

    fn clear_lines(&mut self) {
        let mut new_board = [[None; BOARD_WIDTH]; BOARD_HEIGHT];
        let mut new_row = BOARD_HEIGHT as isize - 1;

        for y in (0..BOARD_HEIGHT).rev() {
            if self.board[y].iter().all(|&cell| cell.is_some()) {
                self.score += 100;
            } else {
                new_board[new_row as usize] = self.board[y];
                new_row -= 1;
            }
        }

        self.board = new_board;
    }
}
