# Entity-Relationship Diagram (Mermaid): Customer Satisfaction Feedback System

```mermaid
erDiagram
    User {
        string id PK
        string username
        string password
        string email
        string role
        bool isActive
        datetime createdAt
        datetime updatedAt
    }
    
    Staff {
        string id PK
        string name
        string imageUrl
        string position
        string contactInfo
        bool status
        datetime createdAt
        datetime updatedAt
    }
    
    Feedback {
        string id PK
        datetime timestamp
        string overallRating
        string comments
    }
    
    Category {
        string id PK
        string name
        string description
    }
    
    DissatisfactionReason {
        string id PK
        string description
        bool active
        string categoryId FK
    }
    
    FeedbackStaff {
        string id PK
        string feedbackId FK
        string staffId FK
        datetime createdAt
    }
    
    FeedbackReason {
        string id PK
        string feedbackId FK
        string reasonId FK
        datetime createdAt
    }
    
    SystemConfig {
        string id PK
        string key
        string value
        datetime createdAt
        datetime updatedAt
    }
    
    Feedback ||--o{ FeedbackStaff : "has staff selections"
    Staff ||--o{ FeedbackStaff : "selected in"
    
    Feedback ||--o{ FeedbackReason : "has reasons"
    DissatisfactionReason ||--o{ FeedbackReason : "associated with"
    
    Category ||--o{ DissatisfactionReason : "categorizes"
```

## Relationship Descriptions

1. **Feedback to FeedbackStaff**: One-to-Many
   - One feedback entry can have multiple staff selections
   - Each FeedbackStaff entry belongs to exactly one Feedback

2. **Staff to FeedbackStaff**: One-to-Many
   - One staff member can be selected in multiple feedback entries
   - Each FeedbackStaff entry references exactly one Staff member

3. **Feedback to FeedbackReason**: One-to-Many
   - One feedback entry can have multiple dissatisfaction reasons
   - Each FeedbackReason entry belongs to exactly one Feedback

4. **DissatisfactionReason to FeedbackReason**: One-to-Many
   - One dissatisfaction reason can be associated with multiple feedback entries
   - Each FeedbackReason entry references exactly one DissatisfactionReason

5. **Category to DissatisfactionReason**: One-to-Many
   - One category can contain multiple dissatisfaction reasons
   - Each dissatisfaction reason belongs to exactly one category 