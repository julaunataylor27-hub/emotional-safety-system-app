import {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sanitiseNotes, getNote} from './lifeJourney.cjs';
import {createLifeJourneyStore} from './lifeJourneyMemory.cjs';

export default function useLifeJourneyNotes() {
  const [notes,setNotes] = useState({});
  const [ready,setReady] = useState(false);
  const [status,setStatus] = useState('loading');
  const [attempt,setAttempt] = useState(0);
  const store = useRef(null);
  if (!store.current) store.current = createLifeJourneyStore(AsyncStorage);
  const current = useRef({});
  const active = useRef(false);
  const request = useRef(0);

  useEffect(() => {
    let cancelled = false;
    active.current = true;
    setStatus('loading');
    store.current.load().then(restored => {
      if (cancelled) return;
      current.current = restored;
      setNotes(restored);setReady(true);setStatus('saved');
    }).catch(() => {if (!cancelled) setStatus('load-error');});
    return () => {cancelled = true;active.current = false;};
  },[attempt]);

  function persist(next) {
    const id = ++request.current;
    setStatus('saving');
    return store.current.save(next).then(() => {
      if (active.current && request.current === id) setStatus('saved');
    }).catch(() => {
      if (active.current && request.current === id) setStatus('save-error');
    });
  }
  function apply(next) {
    current.current = sanitiseNotes(next);
    setNotes(current.current);
    // Queue immediately, even if the screen is left before the write finishes.
    return persist(current.current);
  }
  return {
    notes,ready,status,
    update(stage,change) {
      if (!ready) return;
      return apply({...current.current,[stage.id]:{...getNote(current.current,stage),...change}});
    },
    clearChapter(stage) {
      if (!ready) return;
      const next = {...current.current};delete next[stage.id];return apply(next);
    },
    retry() {if (ready) return persist(current.current);setAttempt(value=>value+1);}
  };
}
