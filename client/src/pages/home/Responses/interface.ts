export interface Date{
    Range: any
    Single: any
}
export interface LinearRange{
    lowerLabel: string
    upperLabel: string
    lowerLimit: number
    upperLimit: number
    chosenValue: number
}

export interface MultiChoice{
    Options: string[]
    Result: boolean[]
}

export interface Content{
    date: Date
    linearRange: LinearRange
    linkedDate: any
    MultiChoice: MultiChoice
    ShortText: string
    Table: any
    Files: any
}


export interface Response{
    QuestionName: string
    Type: string
    Content: Content
    Index: number
    Error: boolean
    Required: boolean
}

export interface Answer{
    id: string
    FormID: string
    Username: string
    UserID: string
    SubmitTime: Date
    Responses: Response[]
}

