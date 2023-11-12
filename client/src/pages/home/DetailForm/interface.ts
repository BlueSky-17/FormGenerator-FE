export interface Question {
    Question: string,
    Description: string,
    Required: boolean,
    ImagePath: string,
    Type: string,
    Content: {}
}

// Content for multi-choice TYPE
export interface MultiChoice {
    MultiChoice: {
        Options: string[],
        ImportedData: string
    }
}

// Content for multi-choice TYPE
export interface ShortText {
    shortText: boolean
}

// Content for date TYPE
export interface Date {
    date: string
}

// Content for linked data TYPE
export interface LinkedData {
    LinkedData: {
        ImportedLink: string[],
        ListOfOptions: {}
    }
}