export class Task {
  public readonly id: string;
  public readonly name: string;
  public readonly dueDate: Date;
  public readonly subject: string;
  public readonly description: string | null;
  public readonly registeredBy: string; // Discord User ID
  public readonly createdAt: Date;

  constructor(
    id: string,
    name: string,
    dueDate: Date,
    subject: string,
    registeredBy: string,
    description: string | null = null,
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.name = name;
    this.dueDate = dueDate;
    this.subject = subject;
    this.description = description;
    this.registeredBy = registeredBy;
    this.createdAt = createdAt;
  }

  public isOverdue(): boolean {
    return new Date() > this.dueDate;
  }

  public isDueToday(): boolean {
    const today = new Date();
    const dueDate = new Date(this.dueDate);

    return (
      today.getDate() === dueDate.getDate() &&
      today.getMonth() === dueDate.getMonth() &&
      today.getFullYear() === dueDate.getFullYear()
    );
  }

  public isDueTomorrow(): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = new Date(this.dueDate);

    return (
      tomorrow.getDate() === dueDate.getDate() &&
      tomorrow.getMonth() === dueDate.getMonth() &&
      tomorrow.getFullYear() === dueDate.getFullYear()
    );
  }

  public getDaysUntilDue(): number {
    const today = new Date();
    const dueDate = new Date(this.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public canBeDeletedBy(userId: string): boolean {
    return this.registeredBy === userId;
  }
}
