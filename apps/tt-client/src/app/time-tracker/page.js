'use client'
import Layout from "@/components/layout";
import NewSession from "@/components/newSession";
import SessionItem from "@/components/sessionItem";
import { Box, Card, List, Typography } from "@mui/material"
import { DateTime, Duration, Interval } from "luxon";
import axios from "axios";
import { useEffect, useState } from "react";

export default function TimeTracker() {
  const [firstLoad, setFirstLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const thisMonday = DateTime.now().startOf('week');
  const thisFriday = thisMonday.plus({days: 4});
  const thisWeek = Interval.fromDateTimes(thisMonday, thisFriday).toFormat('dd LLL').toUpperCase();
  const dates = Interval.fromDateTimes(thisMonday, DateTime.now()).splitBy({days: 1}).map(d => d.start.toISODate());
  const colors = ['#6500CD', '#02105E', '#800015', '#00AA5A', '#CCB107','#0045EA', '#FF4500', '#00BB99', '#FF8080', '#BB0099', '#4400CC', '#80800'];

  useEffect(() => {
    setFirstLoad(true);
  }, []);

  useEffect(() => {
    if (firstLoad) {
      getData();
    }
  }, [firstLoad]);

  useEffect(() => {
    if (summaries.length > 0) {
      setIsReady(true);
    }
  }
  , [summaries]);

  const getData = async () => {
    setIsReady(false);
    await axios.get(process.env.NEXT_PUBLIC_API_URL + '/sessions')
    .then(res => {
      setSessions(res.data.data);
      if (res.data.data.length === 0) {
        const emptySummaries = dates.map(d => {return {date: d, total: '0:00', sessions: [], isCurrent: true}});
        setSummaries(dates.map(d => {return {date: d, total: '0:00', sessions: [], isCurrent: true}}).sort((a,b) => Number(b.date.replaceAll('-','')) - Number(a.date.replaceAll('-',''))));
        return;
      }
      const allSessions = res.data.data;
      const projects = allSessions.map((s) => {return {project: s.task.project.id}}).filter((v, i, a) => a.findIndex(t => (t.project === v.project)) === i);
      for (let i = 0; i < projects.length; i++) {
        projects[i].color = colors[i % colors.length];
      }
      allSessions.sort((a,b) => DateTime.fromISO(a.start_date).diff(DateTime.fromISO(b.start_date)).as('milliseconds'));
      allSessions.forEach(s => {
        s.from = DateTime.fromObject({hour: DateTime.fromISO(s.start_date).get('hour'), minute: DateTime.fromISO(s.start_date).get('minute')});
        s.to = DateTime.fromObject({hour: DateTime.fromISO(s.end_date).get('hour'), minute: DateTime.fromISO(s.end_date).get('minute')});
        s.duration = DateTime.fromISO(s.end_date).diff(DateTime.fromISO(s.start_date)).toFormat('h:mm');
        s.durationMilis = DateTime.fromISO(s.end_date).diff(DateTime.fromISO(s.start_date)).as('milliseconds');
        s.date = DateTime.fromISO(s.start_date).toISODate();
        s.color = projects.find(p => p.project === s.task.project.id).color;
      });
      const sums = [];
      const grouped = Object.values(Object.groupBy(allSessions, ({ date }) => date));
      grouped.forEach(g => {
        const dailySum = Duration.fromMillis(g.map(s => s.durationMilis).reduce((a,c) => a+c)).toFormat('h:mm');
        const isCurrent = Number(DateTime.fromISO(g[0].date).diff(thisMonday).toFormat('h')) >= 0 ? true : false;
        sums.push({date: g[0].date, total: dailySum, sessions: g, isCurrent: isCurrent});
      });
      dates.forEach(d => {
        if (!sums.find(s => s.date === d)) {
          sums.push({date: d, total: '0:00', sessions: [], isCurrent: true});
        }
      });
      sums.sort((a,b) => Number(b.date.replaceAll('-','')) - Number(a.date.replaceAll('-','')));
      setSummaries(sums);
    })
    .catch(err => {
      console.error(err);
    });
  }

  const header = <NewSession onSave={getData} />

  return (
    <Layout header={header}>
    {(<>
      <Typography sx={{color: 'white.main',mb: 1, mt:2}}>{thisWeek}</Typography>
      {isReady && summaries.filter(sum => sum.isCurrent === true).map( sum =>
      <Card sx={{mb: 2, minHeight: 60}}>
        <Box sx={{backgroundColor: 'lightGray.main', width: '100%', px:2, py:2, color: 'gray', display: 'flex', justifyContent: 'space-between'}}>
          <Typography sx={{fontSize: 'small', fontWeight: 'bold'}}>{DateTime.fromISO(sum.date).toRelativeCalendar().toUpperCase()}</Typography>
          <Typography sx={{fontSize: 'small', fontWeight: 'bold'}}>TOTAL: {sum.total}H</Typography>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          <List sx={{width: '100%'}}>
            {sum.sessions.map(s => <SessionItem session={s} onSave={getData} />)}
          </List>
        </Box>
      </Card>)}
    </>)}
    {isReady && summaries.some(s => s.isCurrent === false) && (<>
      <Typography sx={{color: 'white.main',mb: 1, mt:2}}>EARLIER</Typography>
      {isReady && summaries.filter(sum => sum.isCurrent === false).map( sum =>
      <Card sx={{mb: 2, minHeight: 60}}>
        <Box sx={{backgroundColor: 'lightGray.main', width: '100%', px:2, py:2, color: 'gray', display: 'flex', justifyContent: 'space-between'}}>
          <Typography sx={{fontSize: 'small', fontWeight: 'bold'}}>{DateTime.fromISO(sum.date).toFormat('dd LLL').toUpperCase()}</Typography>
          <Typography sx={{fontSize: 'small', fontWeight: 'bold'}}>TOTAL: {sum.total}H</Typography>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          <List sx={{width: '100%'}}>
            {sum.sessions.map(s => <SessionItem session={s} onSave={getData} />)}
          </List>
        </Box>
      </Card>)}
    </>)}
    </Layout>
  );
}
