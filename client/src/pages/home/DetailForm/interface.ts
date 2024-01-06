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
        Constraint: string,
        MaxOptions: number
    }
}

// Content for multi-choice TYPE
export interface ShortText {
    shortText: boolean
}

// Content for date TYPE
export interface Date {
    Date: number
}

export interface File {
    File: {
        MaxFileSize: number,
        FileType: string[],
        MaxFileAmount: number
    }
}

// Content for linked data TYPE
export interface LinkedData {
    LinkedData: {
        ImportedLink: string[],
        ListOfOptions: {}
    }
}

// Content for table TYPE
export interface Table {
    Table: {
        listOfColumn: {
            columnName: string,
            type: string,
            content: {}
        }[]
    }
}