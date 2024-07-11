# Contract Management Service
A Prototype implementation for Core-ledger System Case Study

### Improvements and Enhancements
* Basic:
    * Provide more unit test and integration test to achieve more code coverage and support more edge cases. only currently basic IT are added for transaction, user,and fee
    * Structural wise we can go for using hexagonal architecture or similar structures, currently it's a simple layered structure, and only sub-domains are separated.
    * the clean architecture principle of mapping between each layer can be added to decouple repo - manager(service) - api handlers/event handler, but to keep it simple only a layer of dto is added for the api handlers and mapped to db models.
    * Tables and schema structures can be discussed
    * Creating appropriate error message mechanism, currently in case of exceptions only HttpStatus for corresponding error returns.
    * Adding a user authentication mechanism, and revise the endpoints after having userId from token
    * For API documentation Swagger documentations can be used.
    * Currently, to handle transaction the highest level of isolation level is used (it's both a common practice and also simplest way to impl it) it can be discussed and rewired with other approaches such as using optimistic lock 
* Features (suggestion):
    * Provide a currency management service to dynamically have configuration per currency, e.g. currently for min deposit and max withdraw prices only hardcoded values are used for simplicity
    * Other strategies for fee calculation can be added, currently only fixed and percentage based are supported.
    * currently we can use EOD report to see balance and transaction inconsistency, but it's manual, we can have a job that runs at the end of the day and if there's any data that needs reconciliation it can trigger an alert
* At the end there might be some language barriers throughout the code from JAVA to TypeScript
* Multi c
### Through the code 'Note' comments are for assumption that I made, and 'TODO' comments are for suggestions and improvements. ###