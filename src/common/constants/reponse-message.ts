export const RESPONSE_MESSAGE = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGIN_FAILED: 'Invalid username or password',
    UNAUTHORIZED: 'Unauthorized access',
  },

  USER: {
    FETCHED: 'User fetched successfully',
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    NOT_FOUND: 'User not found',
  },

  HOSPITAL: {
    FETCHED: 'Hospital fetched successfully',
    CREATED: 'Hospital created successfully',
    UPDATED: 'Hospital updated successfully',
    DELETED: 'Hospital deleted successfully',
    EXIST: 'Hospital already exist',
    NOT_FOUND: 'Hospital not found',
  },

  OVERSTAY: {
    FETCHED: 'Overstay fetched successfully',
    CREATED: 'Overstay created successfully',
    UPDATED: 'Overstay updated successfully',
    DELETED: 'Overstay deleted successfully',
    EXIST: 'Overstay already exist',
    NOT_FOUND: 'Overstay not found',
  },
  
  RULE: {
    FETCHED: 'Rule fetched successfully',
    CREATED: 'Rule created successfully',
    UPDATED: 'Rule updated successfully',
    DELETED: 'Rule deleted successfully',
    ACTIVATED: 'Rule activated successfully',
    ARCHIVED: 'Rule archived successfully',
    EXIST: 'Rule already exist',
    NOT_FOUND: 'Rule not found',
  },

  JOB: {
    FETCHED: 'Job fetched successfully',
    CREATED: 'Job created successfully', 
    UPDATED: 'Job updated successfully',
    DELETED: 'Job deleted successfully',
    FINISHED: 'Job finished successfully',
    QUEUED: 'Job queued successfully',
    NOT_FOUND: 'Job not found',
  },

  CLAIM: {
    FETCHED: 'Claim fetched successfully',
    CREATED: 'Claim created successfully',  
    UPDATED: 'Claim updated successfully',
    DELETED: 'Claim deleted successfully',
    ANALYZED: 'Claim analyzed successfully',
    NOT_FOUND: 'Claim not found',
  },

  
  DIAGNOSE: {
    FETCHED: 'Diagnose fetched successfully',
    CREATED: 'Diagnose created successfully',
    UPDATED: 'Diagnose updated successfully',
    DELETED: 'Diagnose deleted successfully',
    EXIST: 'Diagnose already exist',
    NOT_FOUND: 'Diagnose not found',
  },

  
  PROCEDURE: {
    FETCHED: 'Procedure fetched successfully',
    CREATED: 'Procedure created successfully',
    UPDATED: 'Procedure updated successfully',
    DELETED: 'Procedure deleted successfully',
    EXIST: 'Procedure already exist',
    NOT_FOUND: 'Procedure not found',
  },

  CMG: {
    FETCHED: 'CMG fetched successfully',
    CREATED: 'CMG created successfully',
    UPDATED: 'CMG updated successfully',
    DELETED: 'CMG deleted successfully',
    EXIST: 'CMG already exist',
    NOT_FOUND: 'CMG not found',
  },

  CASE_TYPE: {
    FETCHED: 'Case type fetched successfully',
    CREATED: 'Case type created successfully',
    UPDATED: 'Case type updated successfully',
    DELETED: 'Case type deleted successfully',
    EXIST: 'Case type already exist',
    NOT_FOUND: 'Case type not found',
  },

  DASHBOARD: {
    FETCHED: 'Dashboard fetched successfully',
    CREATED: 'Dashboard created successfully',
    UPDATED: 'Dashboard updated successfully',
    DELETED: 'Dashboard deleted successfully',
    EXIST: 'Dashboard already exist',
    NOT_FOUND: 'Dashboard not found',
  },

  VALIDATION: {
    FAILED: 'Validation failed',
    FILE_NOT_FOUND: 'File not found',
  },

  SYSTEM: {
    INTERNAL_ERROR: 'Internal server error',
    FORBIDDEN: 'You do not have permission',
  },
} as const;
