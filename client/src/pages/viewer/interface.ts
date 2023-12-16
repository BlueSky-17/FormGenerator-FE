export interface Response {
    questionName: string,
    type: string,
    required: boolean,
    error: string,
    index: number,
    content: {}
}

// Content result for multi-choice TYPE
export interface ResultMultiChoice {
    multiChoice: {
        options: string[],
        result: boolean[],
        constraint: string,
        maxOptions: number
        disabled: boolean
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
            time: Date,
            type: number
        }
        range: {
            from: Date
            to: Date
            type: number
        }
    }
}

export interface ResultFile {
    files: {
        // id: string,
        fileName: string,
        fileURL: string,
        type: string,
        size: number
    }[]
}

// Content for linked data TYPE
export interface ResultLinkedData {
    linkedData: string[]
}

export interface ResultTable {
    table: {
        listOfColumn: {
            columnName: string,
            type: string,
            content: {}[]
        }[]
    }
}