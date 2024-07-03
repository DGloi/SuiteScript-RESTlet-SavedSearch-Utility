# SuiteScript-RESTlet-SavedSearch-Utility

This repository contains a NetSuite RESTlet script designed to facilitate Saved Search data retrieval. The script allows users to specify the search ID, page size, and page number, ensuring they can fetch specific subsets of data from large saved search results. The utility handles common errors and edge cases, such as invalid page sizes and page numbers, providing error messages to help users correct their requests.

## What Are Saved Searches?

Saved Searches in NetSuite are powerful tools that allow users to create custom views and reports of their data. They enable users to filter, sort, and summarize data across various records, providing valuable insights for decision-making. However, Saved Searches have performance limitations, especially when dealing with large datasets. For extensive data retrieval needs, it's recommended to use SuiteQL for better performance.

This RESTlet serves as an alternative solution for scenarios where using Saved Searches is essential.

## Features

- **Pagination Support**: Easily fetch paginated results from NetSuite saved searches, even for large datasets.
- **Customizable Page Size and Number**: Specify the desired page size (between 5 and 1000) and page number to retrieve.
- **Error Handling**: Comprehensive error messages for invalid requests, such as missing search IDs, invalid page sizes, and out-of-range page numbers.
- **Detailed Logging**: Debug logs to trace the execution flow and troubleshoot issues effectively.
- **Flexible Data Representation**: Retrieve and format search results, including handling of columns with labels, names, and summaries.

## Why Retrieve All Columns?

When executing a saved search, it is crucial to retrieve all columns specified in the search definition. Fields created or customized within the saved search might not appear in the results if they are not explicitly included in the columns being fetched. By ensuring all columns are retrieved, this RESTlet guarantees that the data returned matches the saved search configuration.

## Usage

1. **Install the Script**: Upload the script RESTletSavedSearch.js to your NetSuite account.
2. **Configure the Endpoint**: Set up the RESTlet endpoint in NetSuite.
3. **Make Requests**: Send POST requests to the endpoint with the required parameters (searchID, pageSize, pageNumber).
4. **Retrieve Results**: Receive paginated results in JSON format.

## Example Request Body

```json
{
    "searchID": "customsearch_example",
    "pageSize": 1000,
    "pageNumber": 1
}
