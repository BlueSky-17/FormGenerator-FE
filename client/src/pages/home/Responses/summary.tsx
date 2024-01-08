import React, { useState } from 'react';
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

    // const [viewMode, setViewMode] = useState<string[]>(Array.from({ length: questionLength }, () => 'chart'));
    // const viewChartOrListHandle = (index: number) => {
    //     setViewMode((prevViewMode) => {
    //         let updatedViewMode
    //         if (prevViewMode.length === 0) {
    //             updatedViewMode = new Array(questionLength).fill('chart')
    //         }
    //         else{
    //             updatedViewMode = [...prevViewMode]
    //         }
    //         updatedViewMode[index] = updatedViewMode[index] === 'chart' ? 'list' : 'chart'
    
    //         return updatedViewMode
    //     });
    // };

    const handleMultiChoiceStatics = (responses: Answer[]) => {
        
        function reduceToNLabel(map: Map<string, number>, n: number) {
            const mapEntries = Array.from(map.entries());
            mapEntries.sort((a, b) => b[1] - a[1]);
            const result = mapEntries.slice(0, n - 1);
            const resultMap = new Map(result);
            if(mapEntries.length > n){
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
        for(let i = 0; i < questionLength; i++){
            if(responses[0].Responses[i].Type === "multi-choice"|| responses[0].Responses[i].Type === 'checkbox'){
                temp.push(getLabelResultForMultiChoice(responses,i))
            }
            else{
                temp.push(new Map<string, number>())
            }
        }
        

        for(let i = 0; i < questionLength; i++)
        {
            if(responses[0].Responses[i].Type === "multi-choice" || responses[0].Responses[i].Type === 'checkbox'){
                temp[i] = reduceToNLabel(temp[i], 6)
            }
        }
        return temp
    }
    const dataMap = handleMultiChoiceStatics(props.responses)
    const mapToListOption = function(m: Map<string, number>){
        let data : {
            id: number;
            value: number;
            label: string;
        }[]= []
        let count = 0
        if(m.size){
            m.forEach((value, key) =>{
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
        width: 600,
        height: 400,
      };
    // if (props.responses.length > 0) getLabelResultForMultiChoice(props.responses, 1);

    return (
        <Box>
            {props.responses.length > 0
                ? props.responses[0].Responses.map((res, index) => (
                      <Box key={index} sx={{ backgroundColor: 'white', borderRadius: '15px', marginTop: '15px', paddingBottom: '5px' }}>
                          {/* {res.Type === 'shortText' ? (
                              <Box sx={{ marginBottom: '15px'}}>
                                  <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">
                                      {res.QuestionName}
                                  </Typography>
                                  <Box sx={{maxHeight: props.responses.length > 6 ? '300px' : 'auto', overflowY: 'auto'}}>
                                  {props.responses.map((ans, idx) => (
                                      <Box key={idx} sx={{ minHeight:'44px', backgroundColor: '#EBEBEB', borderRadius: '5px', paddingLeft: '20px', paddingTop: '10px', paddingRight: '20px', marginX: '15px', marginBottom: '5px'}}>
                                          {ans.Responses[index].Content.ShortText}
                                      </Box>
                                  ))}
                                  </Box>
                                  
                              </Box>
                          ) : null} */}
                          {(res.Type === 'multi-choice' || res.Type === 'checkbox' || res.Type === 'dropdown') ? (
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
                                            arcLabel: (item) => `${Math.round(item.value/props.responses.length*100)}%`,    
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

                                {/* {(viewMode.length === 0 || (viewMode as string[])[index] === 'chart') &&
                                  <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: '#364F6B', padding: '20px', fontWeight: 500 }} variant="h5" noWrap component="div">
                                            {res.QuestionName}
                                        </Typography>
                                            <Button onClick={() => viewChartOrListHandle(index)} sx={{ margin: '20px', fontWeight: 500, textTransform: 'initial', fontSize: '15px' }}>
                                            Xem biểu đồ
                                            </Button>
                                    </Box>
                                    <Box sx={{ maxHeight: dataMap[index].size > 6 ? '200px' : 'auto', overflowY: 'auto'}}>
                                       { mapToListOption(dataMap[index]).map((value, index) => (
                                        <Box key ={index} sx={{  backgroundColor: '#EBEBEB', borderRadius: '5px', 
                                                                    paddingLeft: '20px', paddingTop: '10px', paddingRight: '20px', 
                                                                    marginX: '15px', marginBottom: '5px', display: 'flex', 
                                                                    justifyContent: 'space-between' }}>
                                            <Typography minHeight='34px'>
                                                {value.label}
                                            </Typography>
                                            <Typography minHeight='34px'>
                                                {value.value}
                                            </Typography>    
                                            
                                            
                                        </Box>
                                        
                                       ))
                                       }
                                    </Box>
                                  </Box>
                                } */}

                                  
                              </Box>
                          ) : null}
                      </Box>
                  ))
                : null}
        </Box>
    );
}

export default Summary;
