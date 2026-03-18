import { ExamType } from '@/types';

interface ParsedExamType {
  type: ExamType;
  label: string;
  cleanName: string;
}

/**
 * Extracts the exam type from a Georgian subject name string.
 *
 * Patterns matched:
 *   (შუალედური) or (შუალედური N)           -> Midterm
 *   (ფინალური) or (ფინალური გამოცდა)        -> Final
 *   (ქვიზი) or (ქვიზი N)                   -> Quiz
 *   შუალედური N-ის აღდგენა                  -> Retake
 *   შუალედური გამოცდის აღდგენა               -> Retake
 *   დამატებითი ფინალური                      -> Additional
 */
export function parseExamType(subjectName: string): ParsedExamType {
  if (!subjectName || typeof subjectName !== 'string') {
    return { type: ExamType.Unknown, label: '', cleanName: subjectName || '' };
  }

  const trimmed = subjectName.trim();

  // Retake patterns (check before midterm since these also contain შუალედური)
  const retakePattern1 =
    /(.+?)\s*[\-\u2013]\s*შუალედური\s*\d*-?ის\s+აღდგენა/;
  const retakeMatch1 = trimmed.match(retakePattern1);
  if (retakeMatch1) {
    const label = trimmed.replace(retakeMatch1[1], '').trim();
    return {
      type: ExamType.Retake,
      label: label || 'აღდგენა',
      cleanName: retakeMatch1[1].trim(),
    };
  }

  const retakePattern2 = /(.+?)\s*[\-\u2013]\s*შუალედური\s+გამოცდის\s+აღდგენა/;
  const retakeMatch2 = trimmed.match(retakePattern2);
  if (retakeMatch2) {
    const label = trimmed.replace(retakeMatch2[1], '').trim();
    return {
      type: ExamType.Retake,
      label: label || 'აღდგენა',
      cleanName: retakeMatch2[1].trim(),
    };
  }

  // Additional final pattern
  const additionalPattern = /(.+?)\s*[\-\u2013]\s*დამატებითი\s+ფინალური/;
  const additionalMatch = trimmed.match(additionalPattern);
  if (additionalMatch) {
    return {
      type: ExamType.Additional,
      label: 'დამატებითი ფინალური',
      cleanName: additionalMatch[1].trim(),
    };
  }

  // Parenthesized patterns: (შუალედური), (ფინალური), (ქვიზი)
  const parenPattern = /(.+?)\s*\(([^)]+)\)\s*$/;
  const parenMatch = trimmed.match(parenPattern);
  if (parenMatch) {
    const cleanName = parenMatch[1].trim();
    const label = parenMatch[2].trim();

    // Midterm: შუალედური, შუალედური N, შუალედური გამოცდა
    if (/^შუალედური(\s+\d+)?(\s+გამოცდა)?$/.test(label)) {
      return { type: ExamType.Midterm, label, cleanName };
    }

    // Final: ფინალური, ფინალური გამოცდა
    if (/^ფინალური(\s+გამოცდა)?$/.test(label)) {
      return { type: ExamType.Final, label, cleanName };
    }

    // Quiz: ქვიზი, ქვიზი N
    if (/^ქვიზი(\s+\d+)?$/.test(label)) {
      return { type: ExamType.Quiz, label, cleanName };
    }

    // Retake patterns inside parentheses
    if (/აღდგენა/.test(label)) {
      return { type: ExamType.Retake, label, cleanName };
    }

    // Additional final inside parentheses
    if (/დამატებითი/.test(label)) {
      return { type: ExamType.Additional, label, cleanName };
    }

    // If we matched parentheses but didn't recognize the type,
    // still strip the parens for cleanName
    return { type: ExamType.Unknown, label, cleanName };
  }

  // Non-parenthesized patterns as last resort
  if (/აღდგენა/.test(trimmed)) {
    const clean = trimmed.replace(/\s*[-–]\s*(შუალედური|ფინალური).*?(აღდგენა)/, '').trim();
    return { type: ExamType.Retake, label: 'აღდგენა', cleanName: clean || trimmed };
  }
  if (/დამატებითი\s+ფინალური/.test(trimmed)) {
    const clean = trimmed.replace(/\s*[-–]\s*დამატებითი\s+ფინალური/, '').trim();
    return { type: ExamType.Additional, label: 'დამატებითი ფინალური', cleanName: clean || trimmed };
  }

  // No pattern matched
  return { type: ExamType.Unknown, label: '', cleanName: trimmed };
}
