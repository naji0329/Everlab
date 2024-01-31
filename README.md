# Overview

One of features Everlab doctors use in the backend is being able to automatically interpret pathology report data that arrives in the HL7/ORU format.

We are going to give you some database tables in CSV format as well as some sample ORU files and ask you to build a single page application that lets a doctor upload an ORU file and see high-risk results. This should be a full-stack web application using any technology of your choice. Things we care about are:

- Speed - how quickly can you build this?
- Accuracy - is the output correct?
- UX/Product - is this easy to use for a doctor?
- Quality - did you make good technical decisions?

We will leave what to display and how in the front-end up to you. Just keep in mind the user (and their goal) of easily interpreting someone’s report data.

# Context

There a 4 CSV files attached below. Each file represents a table as following

- diagnostic_groups - “groups” of diagnostics, used for easy assignment to a patient and display. e.g “Cholesterol Panel”
- diagnostics - individual tests that you could get done, e.g in Cholesterol Panel you may have HDL, LDL and Total Cholesterol
- diagnostic_metrics - specific metrics associated with a diagnostic, sometimes there are multiple metrics for one diagnostic.
    - Metrics also contain reference ranges of the form standard_lower → standard_higher and everlab_lower → everlab_higher. These indicate the “standard” and “everlab” acceptable values for results in these ranges.
    - Metrics are sometimes personalised based on min_age → max_age and gender. If values are given for a metric we should use the most specific age/gender based reference ranges.
    - oru_sonic_codes and oru_sonic_units fields are `;` delimited fields of possible ORU values that can match to the metric. We need to match on both code and units to get the right reference range.
- conditions - these are possible diagnoses or issues that someone may have based on abnormal metrics. We suggest relevant conditions as a possibility for a doctor to then choose if they agree with or not.

### Files

conditions.csv

diagnostic_metrics.csv

diagnostics.csv

diagnostic_groups.csv

MP826520.oru.txt - note this has lines separated by carriage returns. Your editor may make changes that break it

# Task

We recommend approaching this task by doing the following

- Import the CSV files into a relational database with the correct schema, foreign keys, and values.
- Write an API to parse the ORU file into the individual test items and result values
- Write code to calculate the abnormal test values given our diagnostic_metrics table and the relevant conditions
    - If there is no relevant match then don’t return the result
- Write a front-end that lets a doctor upload an ORU file and see the relevant data.
