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
    
    Rating {
        string id PK
        string name
        string icon
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
        string ratingId FK
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
    
    Feedback ||--o{ FeedbackStaff : "has ratings for"
    Staff ||--o{ FeedbackStaff : "receives ratings in"
    Rating ||--o{ FeedbackStaff : "used in"
    
    Feedback ||--o{ FeedbackReason : "has reasons"
    DissatisfactionReason ||--o{ FeedbackReason : "associated with"
    
    Category ||--o{ DissatisfactionReason : "categorizes"
```

## Relationship Descriptions

1. **Feedback to FeedbackStaff**: One-to-Many
   - One feedback entry can have multiple staff ratings
   - Each FeedbackStaff entry belongs to exactly one Feedback

2. **Staff to FeedbackStaff**: One-to-Many
   - One staff member can be rated in multiple feedback entries
   - Each FeedbackStaff entry references exactly one Staff member

3. **Rating to FeedbackStaff**: One-to-Many
   - One rating type (Heart, Like, Wow, Angry) can be used in many FeedbackStaff entries
   - Each FeedbackStaff entry has exactly one Rating

4. **Feedback to FeedbackReason**: One-to-Many
   - One feedback entry can have multiple dissatisfaction reasons
   - Each FeedbackReason entry belongs to exactly one Feedback

5. **DissatisfactionReason to FeedbackReason**: One-to-Many
   - One dissatisfaction reason can be associated with multiple feedback entries
   - Each FeedbackReason entry references exactly one DissatisfactionReason

6. **Category to DissatisfactionReason**: One-to-Many
   - One category can contain multiple dissatisfaction reasons
   - Each dissatisfaction reason belongs to exactly one category 