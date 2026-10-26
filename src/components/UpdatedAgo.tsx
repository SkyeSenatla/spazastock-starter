import {useEffect, useState} from 'react';

export function UpdatedAgo({ since }: { since: number })    {
  const [now, setNow] = useState(() => Date.now());
  
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 30 000);

        return () => clearInterval(id);
    }, []);

  
  const minutes = Math.floor(seconds / 60);
  
  
  