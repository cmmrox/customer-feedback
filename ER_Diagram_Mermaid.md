# Entity-Relationship Diagram (Mermaid): Customer Satisfaction Feedback System

```mermaid
erDiagram
    Users {
        int id PK
        string username
        string password
        string email
        string role
        datetime created_at
        datetime updated_at
    }
    
    Staff {
        int id PK
        string name
        string image_url
        string position
        string contact_info
        bool status
        datetime created_at
        datetime updated_at
    }
    
    Feedback {
        int id PK
        datetime timestamp
        string overall_rating
        string comments
    }
    
    Ratings {
        int id PK
        string name
        string icon
    }
    
    DissatisfactionReasons {
        int id PK
        string description
        bool active
    }
    
    FeedbackStaff {
        int id PK
        int feedback_id FK
        int staff_id FK
        int rating_id FK
    }
    
    FeedbackReason {
        int id PK
        int feedback_id FK
        int reason_id FK
    }
    
    Categories {
        int id PK
        string name
        string description
    }
    
    Feedback ||--o{ FeedbackStaff : "has ratings for"
    Staff ||--o{ FeedbackStaff : "receives ratings in"
    Ratings ||--o{ FeedbackStaff : "used in"
    
    Feedback ||--o{ FeedbackReason : "has reasons"
    DissatisfactionReasons ||--o{ FeedbackReason : "associated with"
    
    Categories ||--o{ DissatisfactionReasons : "categorizes"
```

## Relationship Descriptions

1. **Feedback to FeedbackStaff**: One-to-Many
   - One feedback entry can have multiple staff ratings
   - Each FeedbackStaff entry belongs to exactly one Feedback

2. **Staff to FeedbackStaff**: One-to-Many
   - One staff member can be rated in multiple feedback entries
   - Each FeedbackStaff entry references exactly one Staff member

3. **Ratings to FeedbackStaff**: One-to-Many
   - One rating type (Heart, Like, Wow, Angry) can be used in many FeedbackStaff entries
   - Each FeedbackStaff entry has exactly one Rating

4. **Feedback to FeedbackReason**: One-to-Many
   - One feedback entry can have multiple dissatisfaction reasons
   - Each FeedbackReason entry belongs to exactly one Feedback

5. **DissatisfactionReasons to FeedbackReason**: One-to-Many
   - One dissatisfaction reason can be associated with multiple feedback entries
   - Each FeedbackReason entry references exactly one DissatisfactionReason

6. **Categories to DissatisfactionReasons**: One-to-Many
   - One category can contain multiple dissatisfaction reasons
   - Each dissatisfaction reason belongs to exactly one category 