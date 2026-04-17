document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State
    let taskData = {
        title: "Complete Task",
        description: "This is a very long description intended to test the expand and collapse functionality of the Stage 1a task. It should hide overflow until the toggle is clicked.",
        priority: "High",
        status: "Pending",
        dueDate: "2026-04-16T18:00"
    };

    // DOM Elements
    const card = document.querySelector('[data-testid="test-todo-card"]');
    const viewMode = document.getElementById('view-mode');
    const editForm = document.getElementById('edit-form');
    const statusControl = document.getElementById('status-control');
    const checkbox = document.getElementById('complete-toggle');

    // 2. Render Function (Updates UI based on taskData)
    function render() {
        // Text Content
        document.querySelector('[data-testid="test-todo-title"]').textContent = taskData.title;
        document.querySelector('[data-testid="test-todo-description"]').textContent = taskData.description;
        document.querySelector('[data-testid="test-todo-priority"]').textContent = taskData.priority;
        document.querySelector('[data-testid="test-todo-status"]').textContent = taskData.status;
        document.querySelector('[data-testid="test-todo-due-date"]').textContent = `Due ${new Date(taskData.dueDate).toLocaleDateString()}`;

        // Sync Status Control & Checkbox
        statusControl.value = taskData.status;
        checkbox.checked = taskData.status === "Done";

        // Priority Indicator (Border Color)
        const indicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
        indicator.className = "priority-indicator"; // reset
        indicator.classList.add(`priority-${taskData.priority.toLowerCase()}-bg`);

        // Visual "Done" State
        const titleEl = document.querySelector('[data-testid="test-todo-title"]');
        taskData.status === "Done" ? titleEl.classList.add('status-done') : titleEl.classList.remove('status-done');
    }

    // 3. Time Logic (Stage 1a - Granular Updates)
    function updateTime() {
        if (taskData.status === "Done") {
            document.querySelector('[data-testid="test-todo-time-remaining"]').textContent = "Completed";
            document.getElementById('overdue-badge').classList.add('hidden');
            return;
        }

        const now = new Date();
        const due = new Date(taskData.dueDate);
        const diff = due - now;

        const timeEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
        const overdueBadge = document.getElementById('overdue-badge');

        if (diff < 0) {
            const absDiff = Math.abs(diff);
            const hours = Math.floor(absDiff / 3600000);
            timeEl.textContent = `Overdue by ${hours}h`;
            timeEl.classList.add('overdue-text');
            overdueBadge.classList.remove('hidden');
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            timeEl.textContent = `Due in ${days} days`;
            timeEl.classList.remove('overdue-text');
            overdueBadge.classList.add('hidden');
        }
    }

    // 4. Interaction Handlers
    statusControl.addEventListener('change', (e) => {
        taskData.status = e.target.value;
        render();
    });

    checkbox.addEventListener('change', (e) => {
        taskData.status = e.target.checked ? "Done" : "Pending";
        render();
    });

    // Expand/Collapse
    document.getElementById('expand-btn').onclick = function() {
        const container = document.getElementById('description-container');
        const isExpanded = container.classList.toggle('collapsed');
        this.textContent = isExpanded ? "Show More" : "Show Less";
        this.setAttribute('aria-expanded', !isExpanded);
    };

    // Edit Mode Toggle
    document.getElementById('edit-btn').onclick = () => {
        document.getElementById('edit-title').value = taskData.title;
        document.getElementById('edit-desc').value = taskData.description;
        document.getElementById('edit-priority').value = taskData.priority;
        document.getElementById('edit-due').value = taskData.dueDate;
        
        viewMode.classList.add('hidden');
        editForm.classList.remove('hidden');
    };

    editForm.onsubmit = (e) => {
        e.preventDefault();
        taskData.title = document.getElementById('edit-title').value;
        taskData.description = document.getElementById('edit-desc').value;
        taskData.priority = document.getElementById('edit-priority').value;
        taskData.dueDate = document.getElementById('edit-due').value;
        
        viewMode.classList.remove('hidden');
        editForm.classList.add('hidden');
        render();
    };

    document.getElementById('cancel-btn').onclick = () => {
        viewMode.classList.remove('hidden');
        editForm.classList.add('hidden');
    };

    // Start
    render();
    setInterval(updateTime, 30000);
    updateTime();
});