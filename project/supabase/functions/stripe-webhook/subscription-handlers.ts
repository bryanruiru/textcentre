// Additional subscription event handlers for the stripe-webhook function

export const handleSubscriptionUpdated = async (subscription: any, supabase: any) => {
  // Try to find user by customer ID if not in metadata
  const userId = subscription.metadata?.userId;
  let userIdToUpdate = userId;
  
  if (!userIdToUpdate) {
    // Try to find user by customer ID
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', subscription.customer)
      .single();
      
    if (userData) {
      userIdToUpdate = userData.id;
    } else {
      // Try to find via subscription ID
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single();
        
      if (subData) {
        userIdToUpdate = subData.user_id;
      } else {
        return { success: false, error: 'User not found' };
      }
    }
  }
  
  // Update subscription in database
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);
  
  return { success: true };
};

export const handleSubscriptionDeleted = async (subscription: any, supabase: any) => {
  // Update subscription in database
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);
  
  // Find the user associated with this subscription
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();
    
  if (subData?.user_id) {
    // Update user premium status
    await supabase
      .from('users')
      .update({ is_premium: false })
      .eq('id', subData.user_id);
  }
  
  return { success: true };
};

export const handleTrialWillEnd = async (subscription: any, supabase: any) => {
  // This event is triggered 3 days before a trial ends
  
  // Find the user associated with this subscription
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();
    
  if (subData?.user_id) {
    // Here you could trigger an email notification to the user
    // or create a notification in your database
    
    // For now, we'll just update the subscription
    await supabase
      .from('subscriptions')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);
  }
  
  return { success: true };
};
