/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Answer } from './interface';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import Responses from '.';

function Summary(props) {
    let getLabelResultForMultiChoice = (responses: Answer[], question: number) => {
        let opts: string[] = responses[0].Responses[question].Content.MultiChoice.Options;
        let result: Map<string, number> = new Map();

        for (let opt of opts) {
            result.set(opt, 0);
        }

        for (let i = 0; i < opts.length; i++) {
            for (let response of responses) {
                let res: boolean = response.Responses[question].Content.MultiChoice.Result[i];
                if (res) result.set(opts[i], (result.get(opts[i]) as number) + 1);
            }
        }
        return result;
    };

    let questionLength: number = props.responses.length > 0 ? props.responses[0].Responses.length : 0;

    const handleMultiChoiceStatics = (responses: Answer[]) => {

        function reduceToNLabel(map: Map<string, number>, n: number) {
            const mapEntries = Array.from(map.entries());
            mapEntries.sort((a, b) => b[1] - a[1]);
            const result = mapEntries.slice(0, n - 1);
            const resultMap = new Map(result);
            if (mapEntries.length > n) {
                let initSum = 0;
                let resSum = 0;
                map.forEach(value => {
                    initSum += value;
                });
                resultMap.forEach(value => {
                    resSum += value
                })
                resultMap.set("Khác", initSum - resSum);
                return resultMap;
            }
            return map;
        }

        let temp: Map<string, number>[] = []
        for (let i = 0; i < questionLength; i++) {
            if (responses[0].Responses[i].Type === "multi-choice" || responses[0].Responses[i].Type === 'checkbox' || responses[0].Responses[i].Type === 'dropdown') {
                temp.push(getLabelResultForMultiChoice(responses, i))
            }
            else {
                temp.push(new Map<string, number>())
            }
        }


        for (let i = 0; i < questionLength; i++) {
            if (responses[0].Responses[i].Type === "multi-choice" || responses[0].Responses[i].Type === 'checkbox' || responses[0].Responses[i].Type === 'dropdown') {
                temp[i] = reduceToNLabel(temp[i], 6)
            }
        }
        return temp
    }
    const dataMap = handleMultiChoiceStatics(props.responses)
    const mapToListOption = function (m: Map<string, number>) {
        let data: {
            id: number;
            value: number;
            label: string;
        }[] = []
        let count = 0
        if (m.size) {
            m.forEach((value, key) => {
                data.push({
                    id: count,
                    value: value,
                    label: key
                })
                count += 1
            })
        }
        return data
    }

    const size = {
        width: 1050,
        height: 400,
    };
    // if (props.responses.length > 0) getLabelResultForMultiChoice(props.responses, 1);

    const [hasSummary, setHasSummary] = useState(false)

    useEffect(() => {
        if (props.responses.length > 0) {
            props.responses[0].Responses.forEach((res) => {
                if (res.Type === 'multi-choice' || res.Type === 'checkbox' || res.Type === 'dropdown')
                    setHasSummary(true)
            })
        }
    }, [])

    return (
        <Box sx={{ height: '100%' }}>
            {props.responses.length > 0 && hasSummary
                ? props.responses[0].Responses.map((res, index) => (
                    <Box key={index}>
                        {(res.Type === 'multi-choice' || res.Type === 'checkbox' || res.Type === 'dropdown') ? (
                            <Box key={index} sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px', paddingBottom: '5px' }}>
                                <Box sx={{ marginBottom: '15px' }}>
                                    {
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">
                                                    {res.QuestionName}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <PieChart
                                                    series={[
                                                        {
                                                            arcLabel: (item) => `${Math.round(item.value / props.responses.length * 100)}%`,
                                                            data: dataMap.length > 0 ? mapToListOption(dataMap[index]) : [],
                                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                                            arcLabelMinAngle: 18,
                                                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
                                                        },
                                                    ]}
                                                    sx={{
                                                        [`& .${pieArcLabelClasses.root}`]: {
                                                            fill: 'white',
                                                            fontWeight: 'bold',
                                                        },
                                                    }}
                                                    {...size}
                                                />
                                            </Box>
                                        </Box>
                                    }
                                </Box>
                            </Box>
                        ) : null}
                    </Box>
                ))
                :
                props.responses.length > 0 && !hasSummary ?
                    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ color: '#364F6B', fontWeight: 500 }}>Biểu mẫu không có dạng câu hỏi thống kê.</Typography>
                    </Box>
                    :
                    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ color: '#364F6B', fontWeight: 500 }}>Biểu mẫu chưa có phản hồi.</Typography>
                    </Box>}
        </Box>
    );
}

export default Summary;
