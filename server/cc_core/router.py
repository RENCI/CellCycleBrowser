class CCTaskRouter(object):
    def route_for_task(self, task, args=None, kwargs=None):
        if task == 'cc_core.tasks.run_model_task':
            return {
                'exchange': 'default',
                'exchange_type': 'topic',
                'routing_key': 'task.default',
            }

        return None