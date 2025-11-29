# Quiz App Design

## Architecture
- **Frontend**: Next.js with React components, App Router
- **Styling**: Tailwind CSS + Shadcn UI component library
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Deployment**: Vercel (recommended for Next.js)

## Database Schema
Using Supabase PostgreSQL:

### Tables
- **users**
  - id (uuid, primary key)
  - email (text, unique)
  - username (text, unique)
  - created_at (timestamp)

- **rooms**
  - id (uuid, primary key)
  - code (text, unique, 6-character)
  - host_id (uuid, foreign key to users)
  - title (text)
  - settings (jsonb: {timeLimit: number, maxParticipants: number})
  - status (enum: waiting, active, finished)
  - created_at (timestamp)

- **questions**
  - id (uuid, primary key)
  - room_id (uuid, foreign key to rooms)
  - question_text (text)
  - options (jsonb array: [{text: string, id: string}])
  - correct_answer (text, option id)
  - order (integer)

- **participants**
  - id (uuid, primary key)
  - room_id (uuid, foreign key to rooms)
  - user_id (uuid, foreign key to users, nullable for guests)
  - username (text, for guests)
  - joined_at (timestamp)

- **answers**
  - id (uuid, primary key)
  - participant_id (uuid, foreign key to participants)
  - question_id (uuid, foreign key to questions)
  - selected_option (text)
  - is_correct (boolean)
  - submitted_at (timestamp)

## UI Design
- **Landing Page**: Hero section with "Create Room" and "Join Room" buttons
- **Create Room**: Multi-step form - Room details, Add questions, Review
- **Join Room**: Input for room code, display room info
- **Waiting Room**: Participant list, chat (optional), Start Quiz button for host
- **Quiz Page**: 
  - Top: Live leaderboard (rank, name, score)
  - Center: Question text, 4 option buttons
  - Bottom: Timer, progress indicator
- **Results Page**: Final leaderboard, expandable user details showing answers per question

## Real-time Features
- Supabase real-time subscriptions for:
  - Room updates (new participants, status changes)
  - Answer submissions (update leaderboard)
  - Quiz progression (next question)

## Component Structure
- **Layout**: Header, Footer
- **Forms**: RoomForm, QuestionForm
- **Quiz**: Leaderboard, QuestionCard, Timer
- **Results**: FinalLeaderboard, UserResults

## Security Considerations
- Server-side validation of answers
- Rate limiting for submissions
- Room codes are unique and not guessable