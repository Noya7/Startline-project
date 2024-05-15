const admin = require('firebase-admin');

const firebaseServiceAccount = JSON.stringify({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDA4+MY8ildb867\nKvUEqojGSUFRGcxoU4XSSUdOAylMyHaGUCfDje2+FoPHmdFh/zTEOyuvW++5xOfZ\nx4Kc1d6AyAMcbHsCZr2WbwxBi5bAwvHkqRqm4k+ogyHum6MlWSohvZlsognDLS3D\naQ0LPVs57QnDC1BT9dbllPBIyoGHZu0cqefZJA46lYKnAIzHbOcHGjkwmJUua1HE\ne3t/3Hs7YnZSWq0cZYsAEHyjw+Z3+f0GssUxZ8EBTyNQWMHWHAs8YiYy+c0mLWi5\nz9HWs3DGfDiSv8JQXRb4xJPApMSGIWR+VTw3cMJLiBNcDV4HQ5YHHXxEShEuqckw\n2l/1SQohAgMBAAECggEAQlffSzw3SADlvPCId4NkKbcWdRuHd7aKh4pWsRlbQiKM\nyaOWGaeeRswdpTBdmPQbJQco/laDvIRiLkB1xxW0Qt0IXOVe5bOKr8wgDgdB4ajr\nY/dZyF58gXwg1p3HXlgtqo84zulorC3E2LowF1aSIvlJa0Ff7pDWyf4RKygjpvsA\nx8qBvR74z+HHpd7HDQvVMcaztZA+PA5EPHJfpZYLlGO/rd7dhhoDvt1RSa4x47ia\n/JxVFITwyUwgPLDZPjMj7sH3IkYw5ZxhaA4fAGQCcnsrp7X24o4DKvrjAzYYJ5AF\n/wdNVb7HN9y4TQNKxQNFgQ28Sp3PdTG9jWtswYhvBQKBgQD6rX4rReRSB9WhQMoa\nTUClp60uBQHJx+sw3k6j7type23uhwArV4gIb1jUaj9PQXuU1L/9lMa+3sQpAab3\nZGvv6ibyf2XObGIO/Q+KzVdBs9VAGY7gS/NBNG5gmjIgk70CRN9a0SO+dqaWlMEK\nJKVxmahXCZWoma7lnHRwhz5KSwKBgQDE/E1TKbjkrTHjYR6wZebcYPAH3MKUELb6\n2yyxf3erMu45+t2KWvc5ZJsUuvL5nJDMJXaa2vHskKxrFdcIC1szHY7qjyQRq+9/\n+6bntfQcApYXqUriQt3/mFyJgiHgRKkqzSIbQ27teTrX1M5s73wfOOrBZYUPXFQi\nxMeU24t5wwKBgHUKYhlENblTLRxwCqzDGwb9Re9xqQcUT6xub1s9IEwFdCtlXt/d\nq4b8rgXnYY3YriGsP8PfHfhqPD5FJjbl7TuEIREiCF+b3SDQaNxOyYnEtDGMfVge\nPgJYv5xdAkCRmjMgAwT9FupLrbYq2AKrX4+txZp1wCmLL8zHAtqzWpMHAoGAN6UR\n7skdarOmIRYhRjEy+tQDWiU5bfwexFQ/ltBsLJdRhl1gUaIKrlLGICADXRGmMZTv\noSTyLCJeIk3kFWin1ZOm+ImA5eEM4blj15alo3fzkDGJbsr2zSnsEggJq8GZi/aw\niMUOw9R4E9oQieNIy8UXQ5R69vDc74lo25r9FmMCgYAFLT3P1K9yaCsjhS1+tLf8\nFABZA68ojjVnmMe4QWhFDtPpo2iM4ePOl3PtcodbwJTZ2Z1B2B9c3wLxWwcfG/kM\ntuRd4T7GPTIPRXrX5yt0Np6Hek1D2LLhffoCE/uo/JEbm+ozFtRPju/Z4zNUV7aI\nJRqoecjOlFP5z8GZ8jxfbw==\n-----END PRIVATE KEY-----\n",
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: process.env.FIREBASE_CERT_URL,
    client_x509_cert_url: "googleapis.com"
})

admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_URL
})

const storage = admin.storage();

module.exports = {admin, storage};