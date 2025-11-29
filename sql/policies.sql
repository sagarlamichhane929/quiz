-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Anyone can view rooms" ON rooms
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create rooms" ON rooms
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their rooms" ON rooms
  FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their rooms" ON rooms
  FOR DELETE USING (auth.uid() = host_id);

-- Questions policies
CREATE POLICY "Anyone can view questions" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Hosts can insert questions for their rooms" ON questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = questions.room_id
      AND rooms.host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update questions for their rooms" ON questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = questions.room_id
      AND rooms.host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete questions for their rooms" ON questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = questions.room_id
      AND rooms.host_id = auth.uid()
    )
  );

-- Participants policies
CREATE POLICY "Anyone can view participants" ON participants
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join rooms" ON participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guests can join rooms" ON participants
  FOR INSERT WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can update their own participation" ON participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Answers policies
CREATE POLICY "Anyone can view answers" ON answers
  FOR SELECT USING (true);

CREATE POLICY "Participants can submit answers" ON answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM participants
      WHERE participants.id = answers.participant_id
      AND (participants.user_id = auth.uid() OR participants.user_id IS NULL)
    )
  );

CREATE POLICY "Participants can update their answers" ON answers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM participants
      WHERE participants.id = answers.participant_id
      AND (participants.user_id = auth.uid() OR participants.user_id IS NULL)
    )
  );