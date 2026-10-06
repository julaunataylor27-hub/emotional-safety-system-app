import {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJourneyStore, defaultAnswers} from './journeyMemory';

export default function useJourneyMemory() {
  const [answers, setAnswers] = useState(defaultAnswers);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [saveAttempt, setSaveAttempt] = useState(0);
  const store = useRef(null);
  if (!store.current) store.current = createJourneyStore(AsyncStorage);
  const latest = useRef('');
  const saved = useRef('');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    store.current.load().then(restored => {
      if (!active) return;
      saved.current = JSON.stringify(restored);
      setAnswers(restored);
      setReady(true);
      setStatus('saved');
    }).catch(() => { if (active) setStatus('load-error'); });
    return () => { active = false; };
  }, [attempt]);

  const snapshot = JSON.stringify(answers);
  latest.current = snapshot;
  useEffect(() => {
    if (!ready || snapshot === saved.current) return;
    let active = true;
    setStatus('saving');
    store.current.save(answers).then(() => {
      saved.current = snapshot;
      if (active && latest.current === snapshot) setStatus('saved');
    }).catch(() => {
      if (active && latest.current === snapshot) setStatus('save-error');
    });
    return () => { active = false; };
  }, [snapshot, ready, saveAttempt]);

  return {
    answers, ready, status,
    update(key, value) {
      if (!ready) return;
      setAnswers(previous => ({...previous, [key]: typeof value === 'function' ? value(previous[key]) : value}));
    },
    retry() { if (ready) setSaveAttempt(value => value + 1); else setAttempt(value => value + 1); },
    async clear() {
      const empty = defaultAnswers();
      setStatus('saving');
      try {
        await store.current.save(empty);
        saved.current = JSON.stringify(empty);
        setAnswers(empty);
        setStatus('saved');
      } catch (error) {
        setStatus('save-error');
        throw error;
      }
    }
  };
}
