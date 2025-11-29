import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/supabase'

type Question = Database['public']['Tables']['questions']['Row']

export async function createRoom(title: string, questions: Omit<Question, 'id' | 'room_id'>[]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Generate unique code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .insert({
      code,
      host_id: user.id,
      title,
    })
    .select()
    .single()

  if (roomError) throw roomError

  // Insert questions
  const questionsWithRoomId = questions.map((q, index) => ({
    ...q,
    room_id: room.id,
    order: index + 1,
  }))

  const { error: questionsError } = await supabase
    .from('questions')
    .insert(questionsWithRoomId)

  if (questionsError) throw questionsError

  return room
}

export async function joinRoom(code: string, username?: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id')
    .eq('code', code)
    .single()

  if (roomError) throw roomError

  const { data: participant, error: participantError } = await supabase
    .from('participants')
    .insert({
      room_id: room.id,
      user_id: user?.id || null,
      username: user ? null : username,
    })
    .select()
    .single()

  if (participantError) throw participantError

  return participant
}

export async function getRoomWithQuestions(code: string) {
  const supabase = createClient()

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select(`
      *,
      questions (*)
    `)
    .eq('code', code)
    .single()

  if (roomError) throw roomError

  return room
}

export async function submitAnswer(participantId: string, questionId: string, selectedOption: string, isCorrect: boolean) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('answers')
    .upsert({
      participant_id: participantId,
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect,
    })

  if (error) throw error

  return data
}

export async function getLeaderboard(roomId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('participants')
    .select(`
      id,
      username,
      user_id,
      answers (
        is_correct
      )
    `)
    .eq('room_id', roomId)

  if (error) throw error

  const leaderboard = data.map(participant => ({
    id: participant.id,
    name: participant.username || 'Anonymous',
    score: participant.answers.filter((a: { is_correct: boolean }) => a.is_correct).length,
  }))

  return leaderboard.sort((a, b) => b.score - a.score)
}