export const defaultTaskList = [{
    "taskName": 'Sales Order Review',
    "projectType": "Both",
    "stage": "Kickoff",
    "sortId": "1",
}, {
    "taskName": 'Internal Kick Off',
    "projectType": "Both",
    "stage": "Kickoff",
    "sortId": "2",
}, {
    "taskName": 'Project Initiation Document',
    "projectType": "Both",
    "stage": "Kickoff",
    "sortId": "3",
}, {
    "taskName": 'Drawings',
    "projectType": "Av/Digital",
    "stage": "Scope",
    "sortId": "1",
}, {
    "taskName": 'Customer Kick Off',
    "projectType": "Both",
    "stage": "Scope",
    "sortId": "2",
}, {
    "taskName": 'Project Plan (Readiness Matrix, RAG/Change Log)',
    "projectType": "Both",
    "stage": "Scope",
    "sortId": "3",
}, {
    "taskName": 'Technical Design',
    "projectType": "MPS",
    "stage": "Scope",
    "sortId": "4",
}, {
    "taskName": 'Statement of Work',
    "projectType": "Both",
    "stage": "Scope",
    "sortId": "5",
}, {
    "taskName": 'Site survey',
    "projectType": "Both",
    "stage": "Scope",
    "sortId": "6",
}, {
    "taskName": 'Network Survey',
    "projectType": "MPS",
    "stage": "Scope",
    "sortId": "7",
}, {
    "taskName": 'Equipment Ordered',
    "projectType": "Both",
    "stage": "Mobilise",
    "sortId": "1",
}, {
    "taskName": 'Labour booked',
    "projectType": "Both",
    "stage": "Mobilise",
    "sortId": "2",
}, {
    "taskName": 'Offsite Testing, PDI & Programming',
    "projectType": "Both",
    "stage": "Mobilise",
    "sortId": "3",
}, {
    "taskName": 'Network Schedule',
    "projectType": "Av/Digital",
    "stage": "Mobilise",
    "sortId": "4",
}, {
    "taskName": 'Roll out plan',
    "projectType": "MPS",
    "stage": "Mobilise",
    "sortId": "5",
}, {
    "taskName": 'RAMS',
    "projectType": "Both",
    "stage": "Mobilise",
    "sortId": "6",
}, {
    "taskName": 'On-Site Programming',
    "projectType": "Av/Digital",
    "stage": "Install",
    "sortId": "1",
}, {
    "taskName": 'Site Visit',
    "projectType": "MPS",
    "stage": "Install",
    "sortId": "2",
}, {
    "taskName": 'Proof of Concept',
    "projectType": "Both",
    "stage": "Install",
    "sortId": "3",
}, {
    "taskName": '1st Fix Install',
    "projectType": "Both",
    "stage": "Install",
    "sortId": "4",
},{
    "taskName": '2nd Fix Install',
    "projectType": "Both",
    "stage": "Install",
    "sortId": "5",
},{
    "taskName": 'Commissioning',
    "projectType": "Both",
    "stage": "Test",
    "sortId": "1",
}, {
    "taskName": 'Snags',
    "projectType": "Both",
    "stage": "Test",
    "sortId": "2",
}, {
    "taskName": 'Training',
    "projectType": "Both",
    "stage": "Test",
    "sortId": "3",
},{
    "taskName": 'Sign-off',
    "projectType": "Both",
    "stage": "Go-Live",
    "sortId": "1",
},{
    "taskName": 'Financial Review',
    "projectType": "Both",
    "stage": "Go-Live",
    "sortId": "2",
},{
    "taskName": 'Completion Survey - PM',
    "projectType": "Both",
    "stage": "Go-Live",
    "sortId": "3",
},{
    "taskName": 'Net Promoter Score - Customer',
    "projectType": "Both",
    "stage": "Go-Live",
    "sortId": "4",
},{
    "taskName": 'Welcome Pack',
    "projectType": "Both",
    "stage": "Go-Live",
    "sortId": "5",
},{
    "taskName": 'Service Handover',
    "projectType": "Both",
    "stage": "Go-Live",
    "sortId": "6",
},];

export const projectStages=[{
    stage:'Kickoff',
    nextStage:'Scope'
},{
    stage:'Scope',
    nextStage:'Mobilise'
},{
    stage:'Mobilise',
    nextStage:'Install'
},{
    stage:'Install',
    nextStage:'Test'
},{
    stage:'Test',
    nextStage:'Go-Live'
},{
    stage:'Go-Live',
    nextStage:'Go-Live'
}]