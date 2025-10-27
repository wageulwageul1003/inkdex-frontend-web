// import { Icons } from '@/components/shared/icons';
// import { useGetFaqCategory } from '@/hooks/faq/useGetFaqCategory';
// import { useSpecificConstant } from '@/hooks/useGetConstant';
// import { useGetConstantLabel } from '@/hooks/useGetLabelValue';
// import { cn } from '@/lib/utils';

// interface FaqItemProps {
//   uuid: string;
//   title: string;
//   category: string;
//   content: string;
//   isExpanded: boolean;
//   onToggle: () => void;
//   type?: string;
// }

// export const FaqItem = ({
//   uuid,
//   title,
//   category,
//   content,
//   isExpanded,
//   onToggle,
//   type,
// }: FaqItemProps) => {
//   // FAQ 카테고리
//   const { constants: faqSupport } = useSpecificConstant('const_faq_support');

//   // 카테고리 (이용 안내 관리)
//   const { data: lectureCategory } = useGetFaqCategory('lecture');
//   const { data: exhibitionCategory } = useGetFaqCategory('exhibition');
//   const { data: readingKitCategory } = useGetFaqCategory('readingKit');

//   const faqCategoryLabel = useGetConstantLabel(faqSupport, category);
//   const lectureCategoryLabel = useGetConstantLabel(
//     lectureCategory ?? [],
//     category,
//   );
//   const exhibitionCategoryLabel = useGetConstantLabel(
//     exhibitionCategory ?? [],
//     category,
//   );
//   const readingKitCategoryLabel = useGetConstantLabel(
//     readingKitCategory ?? [],
//     category,
//   );

//   return (
//     <div className={cn('w-full', isExpanded && 'px-1 py-5')}>
//       <div
//         className={cn(
//           `group flex w-full items-center justify-between`,
//           `cursor-pointer`,
//           !isExpanded && 'px-1 py-5',
//         )}
//         onClick={onToggle}
//       >
//         <div className={cn(`flex-items flex flex-col gap-1`, `md:flex-row`)}>
//           <span className="font-body2 text-gray-400">
//             [
//             {faqCategoryLabel ||
//               lectureCategoryLabel ||
//               exhibitionCategoryLabel ||
//               readingKitCategoryLabel}
//             ]
//           </span>
//           <p className="font-body2-bold line-clamp-2 block flex-1 overflow-hidden text-gray-700 hover:text-gray-400 group-hover:text-gray-400">
//             {title}
//           </p>
//         </div>
//         {isExpanded ? (
//           <Icons.keyboard_arrow_up className="h-m w-m shrink-0 fill-gray-500" />
//         ) : (
//           <Icons.keyboard_arrow_down className="h-m w-m shrink-0 fill-gray-500" />
//         )}
//       </div>

//       {isExpanded && (
//         <div className="mt-3 rounded bg-gray-100 px-5 py-7">
//           <p className="font-body2 text-gray-700">{content}</p>
//         </div>
//       )}
//     </div>
//   );
// };
