/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */
import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAppState } from '../store/AppStateContext';

function Code() {

    const { convictions, dateRanges } = useAppState();

    let innerString = '';
    let irreflexive = 'irreflexive[';
    let order = '';
    let codeString = `module expunge

open util/relation
open util/ordering[Date]

-- An event is a conviction or an expungement
abstract sig Event { 
    date: one Date -- each event has an associated date
}

-- now indicates the current event
var sig now in Event { } 

-- The strict happens-before relation for events (no reflexive pairs)
pred hb[e1, e2: Event] {
    eventually (e1 in now and after eventually e2 in now)
}

-- Well-behaved events
fact {
    -- Once events stop, they stop forever
    always (no now implies always no now)
    -- Every event occurs exactly once
    all e: Event | eventually (e in now and after always e not in now)
}

-- A conviction is a felony or a misdemeanor
abstract sig Conviction extends Event { }
`;

    convictions.map(conviction => {
        codeString += `
abstract sig ${conviction} extends Conviction { }`;
    });

    codeString += `

sig Expungement extends Event {
    con: some Conviction
    -- note: multiple convictions may be expunged in a single event
}

-- Is the conviction c (eventually) expunged?
pred expunged[c: Conviction] {
    some con.c
}

fun exp: Conviction->Expungement {
    ~con
}

-- Well-behaved convictions and expungements
fact {
    always (now in Conviction or now in Expungement or no now)
    all x: Expungement | hb[x.con, x]
    all c: Conviction | lone c.exp
}`;

if(dateRanges.length > 0){
    codeString += `

sig Date {`;
    dateRanges.map(range => {
        order += `${range.within}.compatibleWithOrdering
    `;
        innerString += 
`-- Pairs of dates that are not within ${range?.range}
fun ${range?.beyond}: Date->Date {
    (^(ordering/next) & Date->Date) - ${range?.within}
}

`;
        codeString += `
    ${range?.within}: set Date,`;
    });

    for (let i = 0; i < dateRanges.length; i++) {
        irreflexive += dateRanges[i].within;
        if (i < dateRanges.length - 1) {
            irreflexive += " + ";
            order += `${dateRanges[i].within} in ${dateRanges[i+1].within}
    `;
        }
    }

    irreflexive += "]"
    
    codeString += `
}

${innerString}fun nextDate: Date->Date {
    ordering/next & Date->Date 
}

pred compatibleWithOrdering[r: Date->Date] {
    -- r is a subset of the ordering relation on Dates  
    r in ^(ordering/next)
    -- for any ordered dates d1-d2-d3, if d1-d3 is in r, then d1-d2 and d2-d3 are as well
    all d1: Date | all d2: d1.^ordering/next | all d3: d2.^ordering/next |
        d3 in d1.r implies d2 in d1.r and d3 in d2.r
}

-- Well-behaved dates
fact {
	${irreflexive}
    ${order}
	Date in Event.date
	always (some now implies one now.date)
	all e1, e2: Event | hb[e1, e2] implies e1.date.lt[e2.date]
}`;
}

    return (
        <SyntaxHighlighter language="javascript" style={docco} showLineNumbers>
            {codeString}
        </SyntaxHighlighter>
    );
}

export default Code;
