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
    FETCHED: 'Hospital fetched successfully',
    CREATED: 'Hospital created successfully',
    UPDATED: 'Hospital updated successfully',
    DELETED: 'Hospital deleted successfully',
    EXIST: 'Hospital already exist',
    NOT_FOUND: 'Hospital not found',
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
    NOT_FOUND: 'Claim not found',
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
