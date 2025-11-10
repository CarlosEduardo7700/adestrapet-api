export class LessonProgressListDto {
  userId: string;
  lastAccess: Date;
  isFav: boolean;
  lesson: {
    id: string;
    title: string;
    logoUrl: string;
    duration: number;
  };
}
