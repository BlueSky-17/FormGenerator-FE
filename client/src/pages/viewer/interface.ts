export interface Response {
    questionName: string,
    type: string,
    required: boolean,
    content: {}
}

// Content result for multi-choice TYPE
export interface ResultMultiChoice {
    multiChoice: {
        options: string[],
        result: boolean[]
    }
}

// Content result for multi-choice TYPE
export interface ResultShortText {
    shortText: string
}

// Content for date TYPE
export interface ResultDate {
    date: {
        single: {
            dateOnly: Date,
            hour: Date,
            fulltime: Date
        }
        range: {
            from: {
                dateOnly: Date,
                hour: Date,
                fulltime: Date
            }
            to: {
                dateOnly: Date,
                hour: Date,
                fulltime: Date
            }
        }
    }
}

// Content for linked data TYPE
export interface ResultLinkedData {
    linkedData: string[]
}