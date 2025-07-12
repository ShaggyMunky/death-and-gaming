// Import core functions (for general function definition)
// import * as functions from 'firebase-functions';

// Import specific Firestore trigger functions from the v2 SDK
import {
  onDocumentWritten, // For onWrite (create, update, delete)
  onDocumentUpdated, // For onUpdate (only when existing doc is modified)
} from 'firebase-functions/v2/firestore';

// Import the Admin SDK
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

// --- 1. Cloud Function for Finite Signup Limit ---
// This function needs to trigger when an existing document is UPDATED (specifically, IsPaid changes)
exports.handlePaidSignupCount = onDocumentUpdated(
  'VodRequests/{requestId}', // Path to the document
  async (event) => {
    const oldData = event.data?.before?.data();
    const newData = event.data?.after?.data();

    // Check if IsPaid just changed from false to true AND it hasn't been counted before
    // Also, ensure oldData and newData actually exist (e.g., it's not a deletion or brand new creation)
    if (
      oldData &&
      newData &&
      oldData.IsPaid === false &&
      newData.IsPaid === true &&
      newData.countedTowardsLimit !== true
    ) {
      const limitDocRef = db.doc('app_settings/limits');
      const paidSignupsCountRef = db.doc('public_stats/paid_signups');
      const requestRef = event.data?.after?.ref; // Access the document reference from event.data.after

      if (!requestRef) {
        // Ensure the reference exists
        console.error(
          'No document reference found in event for handlePaidSignupCount.'
        );
        return null;
      }

      try {
        await db.runTransaction(async (transaction) => {
          const limitDoc = await transaction.get(limitDocRef);
          const currentCountDoc = await transaction.get(paidSignupsCountRef);

          const maxLimit = limitDoc.exists
            ? limitDoc.data()?.maxPaidSignups || 0
            : 0;
          const currentPaidCount = currentCountDoc.exists
            ? currentCountDoc.data()?.count || 0
            : 0;

          if (maxLimit > 0 && currentPaidCount >= maxLimit) {
            console.warn(
              `Signup limit of ${maxLimit} reached. Cannot count new paid signup.`
            );
            // In a real app, you might want to consider sending an email notification or handling this case specifically.
            // For now, we'll just throw to abort the transaction.
            throw new Error(
              'Signup limit reached, payment processed but slot not allocated.'
            );
          }

          transaction.set(paidSignupsCountRef, { count: currentPaidCount + 1 });
          transaction.update(requestRef, { countedTowardsLimit: true });

          console.log(
            `Paid signup counted. New total: ${currentPaidCount + 1}`
          );
        });
      } catch (error) {
        console.error('Transaction failed or limit reached:', error);
      }
    }
    return null;
  }
);

// --- 2. Cloud Function for Unpaid Counter ---
// This needs to trigger on any write (create, update, delete) to re-evaluate the count.
exports.updateUnpaidCount = onDocumentWritten(
  // Using onDocumentWritten for any change
  'signup_requests/{requestId}',
  async () => {
    // You don't need oldData/newData directly here unless you wanted to optimize
    // For counting all unpaid, we just query the database.
    const snapshot = await db
      .collection('signup_requests')
      .where('IsPaid', '==', false)
      .get();

    const unpaidCount = snapshot.size;

    await db
      .doc('public_stats/unpaid_requests')
      .set({ count: unpaidCount }, { merge: true });

    console.log(`Unpaid count updated to: ${unpaidCount}`);
    return null;
  }
);

// --- 3. Cloud Function for Calculating Wait Time ---
// This triggers when an existing document is UPDATED (specifically, workflowStatus changes to 'completed')
exports.calculateWaitTime = onDocumentUpdated(
  'signup_requests/{requestId}',
  async (event) => {
    const oldData = event.data?.before?.data();
    const newData = event.data?.after?.data();

    // Ensure we have both old and new data, and the status actually changed to completed
    if (
      oldData &&
      newData &&
      oldData.workflowStatus !== 'completed' &&
      newData.workflowStatus === 'completed'
    ) {
      const inProgressTimestamp = newData.statusTimestamps?.in_progress;
      const completedTimestamp = newData.statusTimestamps?.completed;
      const requestRef = event.data?.after?.ref;

      if (inProgressTimestamp && completedTimestamp && requestRef) {
        // Calculate duration in milliseconds
        // Ensure both are valid Firestore Timestamps before calling toMillis()
        const durationMs =
          completedTimestamp.toMillis() - inProgressTimestamp.toMillis();

        await requestRef.update({ timeToCompletionMs: durationMs });
        console.log(
          `Calculated wait time for ${event.params.requestId}: ${durationMs}ms`
        );
      } else {
        console.warn(
          `Cannot calculate wait time for ${event.params.requestId}: missing in_progress, completed timestamp, or document reference.`
        );
      }
    }
    return null;
  }
);
