export const generic_msg = {
    email_sending_failed: (email) => `🚫 Whoops! Couldn't send an email to ${email}. Try again in a bit.`,
    email_sending_success: (email) => `📧 Boom! Email successfully sent to ${email}.`,
    operation_success: (name) => `✅ ${name} completed! Everything went smooth like butter.`,
    operation_failed: (name) => `❌ ${name} failed! Something went sideways. We're on it.`,
    resource_not_found: (entity) => `🔍 Can't find that ${entity}. Double-check and try again.`,
    too_many_attempts: (entity) => `⛔ Too many wrong ${entity} attempts. Take a breather and try later.`,
    invalid_input: (entity) => `⚠️ Invalid ${entity}. Please check and resubmit.`,
    resource_update_success: (entity) => `🛠️ ${entity} updated successfully. You're good to go!`,
    unauthorized_access: `🚫 Access denied. You don’t have permission to do that.`,
    file_uploading_error: `📁 Upload failed. Something went wrong while saving your files.`,
    too_many_request: `🐢 Slow down! Too many requests. Try again in a moment.`,
    something_went_wrong: `💥 Oops! Something went wrong. We're fixing it ASAP.`
}
