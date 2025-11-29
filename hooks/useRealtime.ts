import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

type RealtimePayload<T> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new?: T
  old?: T
}

export function useRealtime<T extends { id: string }>(
  table: string,
  filter?: string,
  callback?: (payload: RealtimePayload<T>) => void
) {
  const [data, setData] = useState<T[]>([])
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel

    const setupSubscription = async () => {
      channel = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter,
          },
          (payload: RealtimePayload<T>) => {
            if (callback) {
              callback(payload)
            } else {
              // Default behavior: update data
              if (payload.eventType === 'INSERT' && payload.new) {
                setData(prev => [...prev, payload.new])
              } else if (payload.eventType === 'UPDATE' && payload.new) {
                setData(prev => prev.map(item =>
                  item.id === payload.new!.id ? payload.new : item
                ))
              } else if (payload.eventType === 'DELETE' && payload.old) {
                setData(prev => prev.filter(item => item.id !== payload.old!.id))
              }
            }
          }
        )
        .subscribe()
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table, filter, callback, supabase])

  return data
}